/** @OnlyCurrentDoc */
// Bound to the recruiting workbook. Source-controlled here; secrets live only in Script Properties.
var OUTREACH_WORKBOOK_ID = '1WDUFFDYgXqCXGwglBDpr2qB6pUtVpcJw04lMMQohuFA';
var OUTREACH_SHEET = 'Portfolio Links';
var OUTREACH_SYNC_URL = 'https://sulayman-bowles.dev/api/outreach-sync';
var OUTREACH_HEADERS = ['Company', 'Slug', 'Live URL', 'Sync status', 'Last synced', 'Record ID'];

function outreachOutputHash_(rows) {
  var outputs = rows.filter(function(row) { return row[0]; }).map(function(row) {
    return [row[5], String(row[0]).trim().replace(/\s+/g, ' '), row[1], row[2], row[3]];
  }).sort(function(a, b) { return String(a[0]).localeCompare(String(b[0])); });
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(outputs)));
}

function installOutreachAutomation() {
  var workbook = SpreadsheetApp.getActiveSpreadsheet();
  if (!workbook || workbook.getId() !== OUTREACH_WORKBOOK_ID) throw new Error('Open the correct recruiting workbook.');
  var sheet = workbook.getSheetByName(OUTREACH_SHEET);
  if (!sheet) throw new Error('Create the Portfolio Links tab first.');
  if (!PropertiesService.getScriptProperties().getProperty('OUTREACH_SYNC_SECRET')) throw new Error('Configure OUTREACH_SYNC_SECRET in Script Properties first.');
  if (JSON.stringify(sheet.getRange(1, 1, 1, 6).getValues()[0]) !== JSON.stringify(OUTREACH_HEADERS)) throw new Error('Portfolio Links headers do not match.');
  sheet.setFrozenRows(1);
  sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#e8edf2');
  sheet.setColumnWidth(1, 245); sheet.setColumnWidth(2, 195); sheet.setColumnWidth(3, 405);
  sheet.setColumnWidth(4, 340); sheet.setColumnWidth(5, 180); sheet.hideColumns(6);
  sheet.getRange('A1').setNote('Add a company below. The automation generates and verifies its URL. Published links remain stable; deleting a row does not delete its URL.');
  sheet.getRange('B1').setNote('Generated and maintained by the automation.');
  sheet.getRange('C1').setNote('Filled only after the company URL has been verified live.');
  var handlers = ScriptApp.getProjectTriggers().map(function (trigger) { return trigger.getHandlerFunction(); });
  if (handlers.indexOf('outreachSheetEdited') < 0) ScriptApp.newTrigger('outreachSheetEdited').forSpreadsheet(workbook).onEdit().create();
  if (handlers.indexOf('outreachReconcile') < 0) ScriptApp.newTrigger('outreachReconcile').timeBased().everyMinutes(5).create();
  outreachReconcile();
}

function outreachSheetEdited(event) {
  if (!event || !event.range || event.range.getSheet().getName() !== OUTREACH_SHEET || event.range.getColumn() > 1 || event.range.getLastRow() < 2) return;
  outreachReconcile();
}

function outreachReconcile() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return; // The next five-minute reconciliation catches a skipped edit.
  var sheet;
  try {
    var workbook = SpreadsheetApp.getActiveSpreadsheet();
    if (!workbook || workbook.getId() !== OUTREACH_WORKBOOK_ID) throw new Error('Wrong workbook.');
    sheet = workbook.getSheetByName(OUTREACH_SHEET);
    if (!sheet || sheet.getLastRow() < 2) return;
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    var seen = {};
    var idsChanged = false;
    var existingIds = rows.map(function(row) { return String(row[5] || ''); }).filter(function(id) { return /^[0-9a-f-]{36}$/i.test(id); });
    rows.forEach(function (row, index) {
      var name = String(row[0] || '').trim().replace(/\s+/g, ' ');
      if (!name) return;
      var id = String(row[5] || '');
      if (!/^[0-9a-f-]{36}$/i.test(id) || seen[id]) {
        // Never rewrite existing IDs from a stale whole-column snapshot. A user
        // or API may reorder rows independently of the script's synchronization lock.
        var current = sheet.getRange(index + 2, 1, 1, 6).getValues()[0];
        if (String(current[0] || '').trim().replace(/\s+/g, ' ') !== name || String(current[5] || '') !== id) return;
        id = Utilities.getUuid();
        sheet.getRange(index + 2, 6).setValue(id);
        idsChanged = true;
      }
      seen[id] = true;
    });
    // Persist identity before calling the server, so failed writeback cannot create a second URL.
    if (idsChanged) SpreadsheetApp.flush();
    rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    var freshIds = rows.map(function(row) { return String(row[5] || ''); });
    if (existingIds.some(function(id) { return freshIds.indexOf(id) < 0; })) throw new Error('Rows moved during ID assignment; automatic retry will reconcile the current rows.');
    seen = {};
    var companies = [];
    rows.forEach(function(row) {
      var name = String(row[0] || '').trim().replace(/\s+/g, ' ');
      if (!name) return;
      var id = String(row[5] || '');
      if (!/^[0-9a-f-]{36}$/i.test(id) || seen[id]) throw new Error('Rows changed during ID assignment; automatic retry will assign missing IDs.');
      seen[id] = true;
      companies.push({ recordId: id, company: name });
    });
    if (!companies.length) return;
    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty('OUTREACH_SYNC_SECRET');
    if (!secret || secret.length < 32) throw new Error('Configure the sync secret in Script Properties.');
    var inputHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(companies.slice().sort(function(a,b) { return a.recordId.localeCompare(b.recordId); }))));
    var complete = rows.every(function(row) { return !row[0] || (row[2] && row[3] === 'Live'); });
    if (inputHash === properties.getProperty('OUTREACH_LAST_VERIFIED_INPUT') && complete && outreachOutputHash_(rows) === properties.getProperty('OUTREACH_LAST_VERIFIED_OUTPUT')) return;
    var payload = JSON.stringify({ spreadsheetId: OUTREACH_WORKBOOK_ID, sheet: OUTREACH_SHEET, companies: companies });
    var timestamp = String(Date.now());
    var signature = Utilities.computeHmacSha256Signature(timestamp + '.' + payload, secret)
      .map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
    var response = UrlFetchApp.fetch(OUTREACH_SYNC_URL, {
      method: 'post', contentType: 'application/json', payload: payload, muteHttpExceptions: true,
      headers: { 'X-Outreach-Timestamp': timestamp, 'X-Outreach-Signature': signature },
    });
    var result;
    try { result = JSON.parse(response.getContentText()); } catch (_) { throw new Error('Sync endpoint did not return JSON.'); }
    if (response.getResponseCode() !== 200 || !Array.isArray(result.links)) throw new Error(result.error || 'Registry synchronization failed.');
    var previousLive = {};
    rows.forEach(function(row) { if (row[2] && row[3] === 'Live') previousLive[row[5]] = row[2]; });
    var pending = result.links.filter(function(link) { return previousLive[link.recordId] !== link.url; });
    var uniqueUrls = [];
    pending.forEach(function(link) { if (uniqueUrls.indexOf(link.url) < 0) uniqueUrls.push(link.url); });
    var verified = {};
    // Only new/pending URLs are fetched. A successful no-change poll does no network writes.
    if (uniqueUrls.length) {
      // Give a just-published snapshot a short propagation window before deferring
      // verification to the next scheduled run. Retry only URLs still pending.
      var retryDelays = [0, 3000, 8000];
      for (var attempt = 0; attempt < retryDelays.length; attempt++) {
        var unchecked = uniqueUrls.filter(function(url) { return verified[url] !== true; });
        if (!unchecked.length) break;
        if (retryDelays[attempt]) Utilities.sleep(retryDelays[attempt]);
        var checks = UrlFetchApp.fetchAll(unchecked.map(function(url) { return { url: url, method: 'get', followRedirects: false, muteHttpExceptions: true }; }));
        checks.forEach(function(check, index) {
          var url = unchecked[index]; var slug = url.slice(url.lastIndexOf('/') + 1);
          var html = check.getContentText();
          verified[url] = check.getResponseCode() === 200 && html.indexOf('<meta name="outreach-company" content="' + slug + '">') >= 0 && html.indexOf('https://sulayman-bowles.dev/') >= 0;
        });
      }
    }
    var byId = {};
    result.links.forEach(function(link) { byId[link.recordId] = link; });
    // Resolve rows by stable ID again after network calls; never write to a stale row index.
    var fresh = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    var allLive = true;
    properties.deleteProperty('OUTREACH_LAST_VERIFIED_INPUT');
    properties.deleteProperty('OUTREACH_LAST_VERIFIED_OUTPUT');
    fresh.forEach(function(row, index) {
      var link = byId[row[5]];
      if (!link || String(row[0]).trim().replace(/\s+/g, ' ') !== link.company) { if (row[0]) allLive = false; return; }
      var live = previousLive[link.recordId] === link.url || verified[link.url] === true;
      if (!live) allLive = false;
      sheet.getRange(index + 2, 2, 1, 4).setValues([[link.slug, live ? link.url : row[2], live ? 'Live' : 'Pending verification — automatic retry', new Date()]]);
    });
    sheet.getRange(2, 5, Math.max(1, fresh.length), 1).setNumberFormat('yyyy-mm-dd hh:mm');
    SpreadsheetApp.flush();
    // A concurrent sort can also occur during output writes. Cache success only
    // after observing the actual ID/company/URL association stored in the sheet.
    var confirmed = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    var confirmedLive = confirmed.every(function(row) {
      if (!row[0]) return true;
      var link = byId[row[5]];
      return link && String(row[0]).trim().replace(/\s+/g, ' ') === link.company && row[1] === link.slug && row[2] === link.url && row[3] === 'Live';
    });
    if (allLive && confirmedLive) {
      properties.setProperty('OUTREACH_LAST_VERIFIED_INPUT', inputHash);
      properties.setProperty('OUTREACH_LAST_VERIFIED_OUTPUT', outreachOutputHash_(confirmed));
    }
  } catch (error) {
    if (sheet && sheet.getLastRow() >= 2) {
      var current = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
      current.forEach(function(row, index) {
        if (row[0]) sheet.getRange(index + 2, 4).setValue('Sync error — ' + String(error.message || 'Retrying').slice(0, 180));
      });
    }
    // Let Google's built-in trigger failure reporting notify the owning account.
    throw error;
  } finally { lock.releaseLock(); }
}
