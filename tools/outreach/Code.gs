/** @OnlyCurrentDoc */
// Bound to the recruiting workbook. Source-controlled here; secrets live only in Script Properties.
var OUTREACH_WORKBOOK_ID = '1WDUFFDYgXqCXGwglBDpr2qB6pUtVpcJw04lMMQohuFA';
var OUTREACH_SHEET = 'Portfolio Links';
var OUTREACH_SYNC_URL = 'https://sulayman-bowles.dev/api/outreach-sync';
var OUTREACH_HEADERS = ['Company', 'Slug', 'Live URL', 'Sync status', 'Last synced', 'Record ID'];
var OUTREACH_OPENINGS_SHEET = 'Personalized Openings';
var OUTREACH_OPENINGS_HEADERS = ['Page ID', 'Company', 'Relationship ID', 'Greeting name', 'App Key', 'Role / team', 'Job description URL', 'Job description excerpt', 'Priority 1', 'Evidence 1', 'Priority 2', 'Evidence 2', 'Why company', 'Opening line 1', 'Opening line 2', 'Opening line 3', 'Opening line 4', 'Copy status', 'Personalized URL', 'Sync status', 'Last synced', 'Local preview URL'];
var OUTREACH_OPENINGS_NOTES = [
  'Generated stable UUID. Keep this ID with the row when sorting; a copied pairing gets its own new ID.',
  'Company label, using the same mapping as Portfolio Links. This stays attached to the Page ID.',
  'Optional existing Relationships ID. This private source field is never sent to the website.',
  'Optional verified first name. Leave blank when the recipient is unknown; write the greeting into the four final lines.',
  'Optional existing Applications App Key. No invented or inferred vacancy.',
  'Specific role or team from the workbook or a real job description. Context for writing; not automatically published.',
  'Real job-description source URL. Required together with an excerpt when a JD priority is claimed.',
  'Relevant source excerpt supporting the selected job priorities. Leave blank when no JD has been sourced.',
  'One priority explicitly supported by the JD URL and excerpt. Leave blank for a role-based draft.',
  'Truthful personal work, article or source supporting Priority 1. Required when Priority 1 is populated.',
  'Optional second priority explicitly supported by the JD URL and excerpt.',
  'Truthful personal work, article or source supporting Priority 2. Required when Priority 2 is populated.',
  'Concrete reason you like this company or team, connected to your actual interests or work.',
  'Public row 1. Authored wording or a reviewed template. {{greeting}} becomes "Name — " or blank; {{company}} uses B and {{role}} uses F.',
  'Public row 2. Optional {{priority_1}}, {{priority_2}}, {{evidence_1}}, {{evidence_2}} use I/K/J/L. Used fields must be nonempty when Ready.',
  'Public row 3. Optional {{why_company}} uses M. Ready copy must resolve every token; unknown or missing tokens block publication.',
  'Public row 4. Final resolved copy needs four trimmed nonempty rows, at most 112 characters each and 44 words total, without URLs, emails or control characters.',
  'Draft leaves edited copy unpublished and retains any previous published version. Ready requests publication after release. Paused disables the page.',
  'Generated stable server URL. Filled only after a real GET verifies the company, Page ID and exact four rows; an older verified URL may remain for Draft or Paused.',
  'Generated reconciliation receipt. Only Ready copy verified through a real page GET is marked Live.',
  'Generated timestamp from a completed reconciliation; it is not a deployment receipt.',
  'Prepared local-review link. A localhost URL is not a published or recruiter-ready URL.'
];

// Safe worksheet-only setup. This never installs triggers, changes credentials,
// or calls the public sync endpoint.
function installPersonalizedOpeningsSheet() {
  var workbook = SpreadsheetApp.getActiveSpreadsheet();
  if (!workbook || workbook.getId() !== OUTREACH_WORKBOOK_ID) throw new Error('Open the correct recruiting workbook.');
  return outreachInstallOpeningsSheet_(workbook);
}

function outreachInstallOpeningsSheet_(workbook) {
  var sheet = workbook.getSheetByName(OUTREACH_OPENINGS_SHEET);
  if (!sheet) sheet = workbook.insertSheet(OUTREACH_OPENINGS_SHEET);
  var header = sheet.getRange(1, 1, 1, 22).getValues()[0];
  if (header.some(function(value) { return value !== ''; }) && JSON.stringify(header) !== JSON.stringify(OUTREACH_OPENINGS_HEADERS)) throw new Error('Personalized Openings headers do not match; no existing cells were overwritten.');
  if (!header.some(function(value) { return value !== ''; })) sheet.getRange(1, 1, 1, 22).setValues([OUTREACH_OPENINGS_HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 22).setFontWeight('bold').setBackground('#e8edf2').setWrap(true);
  OUTREACH_OPENINGS_NOTES.forEach(function(note, index) { sheet.getRange(1, index + 1).setNote(note); });
  var widths = [290, 195, 200, 165, 200, 285, 340, 380, 230, 380, 230, 380, 380, 310, 310, 310, 310, 180, 410, 340, 180, 410];
  widths.forEach(function(width, index) { sheet.setColumnWidth(index + 1, width); });
  var rows = Math.max(1, sheet.getMaxRows() - 1);
  var statusRule = SpreadsheetApp.newDataValidation().requireValueInList(['Draft', 'Ready', 'Paused'], true).setAllowInvalid(false).setHelpText('Draft, Ready or Paused. Only Ready requests publication.').build();
  sheet.getRange(2, 18, rows, 1).setDataValidation(statusRule);
  sheet.getRange(2, 10, rows, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(I2="",LEN(TRIM(J2))>0)').setAllowInvalid(false).setHelpText('Add truthful evidence when Priority 1 is populated.').build());
  sheet.getRange(2, 12, rows, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(K2="",LEN(TRIM(L2))>0)').setAllowInvalid(false).setHelpText('Add truthful evidence when Priority 2 is populated.').build());
  var populated = sheet.getLastRow() - 1;
  if (populated > 0) sheet.getRange(2, 7, populated, 11).setWrap(true);
  SpreadsheetApp.flush();
  return sheet;
}

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
  if (workbook.getSheetByName(OUTREACH_OPENINGS_SHEET)) outreachInstallOpeningsSheet_(workbook);
  var handlers = ScriptApp.getProjectTriggers().map(function (trigger) { return trigger.getHandlerFunction(); });
  if (handlers.indexOf('outreachSheetEdited') < 0) ScriptApp.newTrigger('outreachSheetEdited').forSpreadsheet(workbook).onEdit().create();
  if (handlers.indexOf('outreachReconcile') < 0) ScriptApp.newTrigger('outreachReconcile').timeBased().everyMinutes(5).create();
  outreachReconcile();
}

function outreachSheetEdited(event) {
  if (!event || !event.range || event.range.getLastRow() < 2) return;
  var name = event.range.getSheet().getName();
  if (name === OUTREACH_SHEET ? event.range.getColumn() > 1 : name !== OUTREACH_OPENINGS_SHEET || event.range.getColumn() > 21) return;
  outreachReconcile();
}

function outreachReconcile() {
  var failure;
  try { outreachReconcileCompanies_(); } catch (error) { failure = error; }
  try { outreachReconcileOpenings_(); } catch (error) { if (!failure) failure = error; }
  if (failure) throw failure;
}

function outreachReconcileCompanies_() {
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
    var signature = Utilities.computeHmacSha256Signature(timestamp + '.' + payload, secret, Utilities.Charset.UTF_8)
      .map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
    var response = UrlFetchApp.fetch(OUTREACH_SYNC_URL, {
      method: 'post', contentType: 'application/json; charset=utf-8', payload: payload, muteHttpExceptions: true,
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

function outreachOpeningCompany_(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function outreachOpeningRow_(row) {
  var lines;
  try { lines = outreachResolveOpeningLines_(row); } catch (_) { lines = ['', '', '', '']; }
  return { recordId: String(row[0] || ''), company: outreachOpeningCompany_(row[1]), status: String(row[17] || 'Draft').trim(), lines: lines };
}

function outreachResolveOpeningLines_(row) {
  var clean = function(value) { return String(value || '').trim().replace(/\s+/g, ' '); };
  var name = clean(row[3]);
  var fields = { greeting: name ? name + ' — ' : '', company: clean(row[1]), role: clean(row[5]), priority_1: clean(row[8]), priority_2: clean(row[10]), evidence_1: clean(row[9]), evidence_2: clean(row[11]), why_company: clean(row[12]) };
  return row.slice(13, 17).map(function(value) {
    var resolved = String(value || '').replace(/\{\{\s*([a-z_0-9]+)\s*\}\}/g, function(_, token) {
      if (!Object.prototype.hasOwnProperty.call(fields, token)) throw new Error('Unknown opening token: ' + token + '.');
      if (token !== 'greeting' && !fields[token]) throw new Error('Opening token {{' + token + '}} needs a nonempty source field.');
      return fields[token];
    }).trim().replace(/\s+/g, ' ');
    if (/\{\{|\}\}/.test(resolved)) throw new Error('Unresolved opening token.');
    return resolved;
  });
}

function outreachOpeningHash_(value) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(value)));
}

function outreachOpeningOutputHash_(rows) {
  return outreachOpeningHash_(rows.filter(function(row) { return row[1]; }).map(function(row) {
    return [row[0], outreachOpeningCompany_(row[1]), row[18], row[19]];
  }).sort(function(a, b) { return String(a[0]).localeCompare(String(b[0])); }));
}

function outreachValidOpeningLines_(lines) {
  return Array.isArray(lines) && lines.length === 4 && lines.every(function(line) {
    return typeof line === 'string' && line === line.trim() && line.length > 0 && line.length <= 112 && !/[\x00-\x1f\x7f]|https?:\/\/|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\{\{|\}\}/i.test(line);
  }) && lines.join(' ').split(/\s+/).length <= 44;
}

function outreachOpeningHtmlMatches_(html, opening, slug) {
  if (html.indexOf('<meta name="outreach-company" content="' + slug + '">') < 0 || html.indexOf('<meta name="outreach-opening-id" content="' + opening.recordId + '">') < 0) return false;
  var script = html.match(/<script\b(?=[^>]*\bid=["']outreach-opening-copy["'])[^>]*>([\s\S]*?)<\/script>/i);
  if (!script) return false;
  try {
    var copy = JSON.parse(script[1]);
    return copy.id === opening.recordId && JSON.stringify(copy.lines) === JSON.stringify(opening.lines);
  } catch (_) { return false; }
}

function outreachOpeningProof_(properties, id) {
  try { return JSON.parse(properties.getProperty('OUTREACH_OPENING_VERIFIED_' + id) || 'null'); } catch (_) { return null; }
}

function outreachReconcileOpenings_() {
  var workbook = SpreadsheetApp.getActiveSpreadsheet();
  if (!workbook || workbook.getId() !== OUTREACH_WORKBOOK_ID) throw new Error('Wrong workbook.');
  var sheet = workbook.getSheetByName(OUTREACH_OPENINGS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  var submitted = {};
  try {
    if (JSON.stringify(sheet.getRange(1, 1, 1, 22).getValues()[0]) !== JSON.stringify(OUTREACH_OPENINGS_HEADERS)) throw new Error('Personalized Openings headers do not match.');
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 22).getValues();
    var seen = {};
    var changedIds = false;
    var existingIds = rows.filter(function(row) { return row[1]; }).map(function(row) { return String(row[0] || ''); }).filter(function(id) { return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id); });
    rows.forEach(function(row, index) {
      if (!outreachOpeningCompany_(row[1])) return;
      var id = String(row[0] || '');
      if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id) || seen[id]) {
        // Guard the whole editorial row: two pairings can share a company.
        var current = sheet.getRange(index + 2, 1, 1, 22).getValues()[0];
        if (JSON.stringify(current.slice(0, 18)) !== JSON.stringify(row.slice(0, 18))) return;
        id = Utilities.getUuid().toLowerCase();
        sheet.getRange(index + 2, 1).setValue(id);
        changedIds = true;
      }
      seen[id] = true;
    });
    // Identity persists before any network action, including a failed publish.
    if (changedIds) SpreadsheetApp.flush();
    rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 22).getValues();
    var freshIds = rows.map(function(row) { return String(row[0] || ''); });
    if (existingIds.some(function(id) { return freshIds.indexOf(id) < 0; })) throw new Error('Rows moved during ID assignment; automatic retry will reconcile the current rows.');
    seen = {};
    var openings = [];
    rows.forEach(function(row) {
      if (!outreachOpeningCompany_(row[1])) return;
      var opening = outreachOpeningRow_(row);
      if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(opening.recordId) || seen[opening.recordId]) throw new Error('Rows changed during ID assignment; automatic retry will assign missing IDs.');
      seen[opening.recordId] = true;
      submitted[opening.recordId] = opening;
      if (['Draft', 'Ready', 'Paused'].indexOf(opening.status) < 0) throw new Error('Choose Draft, Ready or Paused for each populated opening.');
      if (opening.status === 'Ready') {
        opening.lines = outreachResolveOpeningLines_(row);
        if (!outreachValidOpeningLines_(opening.lines)) throw new Error('Ready copy needs four trimmed nonempty lines, at most 112 characters each and 44 words total, without URLs, email addresses or control characters.');
        if ((row[8] || row[10]) && (!/^https?:\/\//i.test(String(row[6] || '').trim()) || !String(row[7] || '').trim())) throw new Error('A claimed JD priority needs the real job-description URL and supporting excerpt.');
        if (row[8] && !String(row[9] || '').trim() || row[10] && !String(row[11] || '').trim()) throw new Error('A selected priority needs truthful personal evidence.');
      }
      openings.push(opening);
    });
    if (!openings.length) return;
    var properties = PropertiesService.getScriptProperties();
    var secret = properties.getProperty('OUTREACH_SYNC_SECRET');
    if (!secret || secret.length < 32) throw new Error('Configure the sync secret in Script Properties.');
    var inputHash = outreachOpeningHash_(openings.slice().sort(function(a, b) { return a.recordId.localeCompare(b.recordId); }));
    var complete = rows.every(function(row) {
      if (!row[1]) return true;
      var status = String(row[17] || 'Draft').trim();
      return status === 'Ready' ? row[19] === 'Live' && row[18] === 'https://sulayman-bowles.dev/for/' + row[0] : status === 'Paused' ? row[19] === 'Paused' : String(row[19] || '').indexOf('Draft —') === 0;
    });
    if (inputHash === properties.getProperty('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT') && complete && outreachOpeningOutputHash_(rows) === properties.getProperty('OUTREACH_OPENINGS_LAST_VERIFIED_OUTPUT')) return;
    var payload = JSON.stringify({ spreadsheetId: OUTREACH_WORKBOOK_ID, sheet: OUTREACH_OPENINGS_SHEET, openings: openings });
    var timestamp = String(Date.now());
    var signature = Utilities.computeHmacSha256Signature(timestamp + '.' + payload, secret, Utilities.Charset.UTF_8).map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
    var response = UrlFetchApp.fetch(OUTREACH_SYNC_URL, { method: 'post', contentType: 'application/json; charset=utf-8', payload: payload, muteHttpExceptions: true, headers: { 'X-Outreach-Timestamp': timestamp, 'X-Outreach-Signature': signature } });
    var result;
    try { result = JSON.parse(response.getContentText()); } catch (_) { throw new Error('Sync endpoint did not return JSON.'); }
    if (response.getResponseCode() !== 200 || !Array.isArray(result.links)) throw new Error(result.error || 'Opening synchronization failed.');
    var byId = {};
    result.links.forEach(function(link) {
      var opening = submitted[link.recordId];
      if (!opening || byId[link.recordId] || link.company !== opening.company || link.status !== opening.status || link.url && link.url !== 'https://sulayman-bowles.dev/for/' + opening.recordId || link.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(link.slug) || link.status === 'Ready' && (!link.url || !link.slug)) throw new Error('Sync returned a mismatched opening identity, status or URL.');
      byId[link.recordId] = link;
    });
    if (result.links.length !== openings.length) throw new Error('Sync returned an incomplete opening receipt.');
    var verified = {};
    var pending = [];
    openings.forEach(function(opening) {
      if (opening.status !== 'Ready') return;
      var link = byId[opening.recordId];
      var proof = outreachOpeningProof_(properties, opening.recordId);
      if (proof && proof.active === true && proof.hash === outreachOpeningHash_(opening) && proof.url === link.url && proof.slug === link.slug) verified[opening.recordId] = true;
      else pending.push(opening.recordId);
    });
    // A stable URL may still serve the previous four rows during propagation.
    // Verify the public copy for each changed Ready row, not just its URL.
    var retryDelays = [0, 3000, 8000];
    for (var attempt = 0; attempt < retryDelays.length; attempt++) {
      var unchecked = pending.filter(function(id) { return verified[id] !== true; });
      if (!unchecked.length) break;
      if (retryDelays[attempt]) Utilities.sleep(retryDelays[attempt]);
      var checks = UrlFetchApp.fetchAll(unchecked.map(function(id) { return { url: byId[id].url, method: 'get', followRedirects: false, muteHttpExceptions: true }; }));
      checks.forEach(function(check, index) {
        var id = unchecked[index];
        verified[id] = check.getResponseCode() === 200 && outreachOpeningHtmlMatches_(check.getContentText(), submitted[id], byId[id].slug);
      });
    }
    properties.deleteProperty('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT');
    properties.deleteProperty('OUTREACH_OPENINGS_LAST_VERIFIED_OUTPUT');
    var outputs = {};
    openings.forEach(function(opening) {
      var link = byId[opening.recordId];
      var proof = outreachOpeningProof_(properties, opening.recordId);
      var historical = proof && proof.url === link.url ? proof.url : '';
      var status = opening.status === 'Paused' ? 'Paused' : opening.status === 'Draft' ? historical ? proof.active === false ? 'Draft — previous version paused' : 'Draft — previous published copy retained' : 'Draft — unpublished copy' : verified[opening.recordId] ? 'Live' : 'Pending verification — automatic retry';
      outputs[opening.recordId] = [opening.status === 'Ready' && verified[opening.recordId] ? link.url : historical, status];
      // Resolve each destination by stable ID again after the network requests.
      var fresh = sheet.getRange(2, 1, sheet.getLastRow() - 1, 22).getValues();
      var matches = [];
      fresh.forEach(function(row, index) { if (String(row[0] || '') === opening.recordId) matches.push(index); });
      if (matches.length !== 1) return;
      var index = matches[0];
      var current = sheet.getRange(index + 2, 1, 1, 22).getValues()[0];
      if (JSON.stringify(outreachOpeningRow_(current)) !== JSON.stringify(opening)) return;
      sheet.getRange(index + 2, 19, 1, 3).setValues([[outputs[opening.recordId][0], status, new Date()]]);
      sheet.getRange(index + 2, 21).setNumberFormat('yyyy-mm-dd hh:mm');
    });
    SpreadsheetApp.flush();
    // Never cache a success after a concurrent sort, copy edit or failed write.
    var confirmed = sheet.getRange(2, 1, sheet.getLastRow() - 1, 22).getValues();
    var allComplete = true;
    var confirmedIds = {};
    confirmed.forEach(function(row) {
      if (!row[1]) return;
      var id = String(row[0] || '');
      var opening = submitted[id];
      var output = outputs[id];
      if (confirmedIds[id] || !opening || !output || JSON.stringify(outreachOpeningRow_(row)) !== JSON.stringify(opening) || row[18] !== output[0] || row[19] !== output[1]) { allComplete = false; return; }
      confirmedIds[id] = true;
      if (opening.status === 'Ready') {
        if (verified[id] !== true) { allComplete = false; return; }
        properties.setProperty('OUTREACH_OPENING_VERIFIED_' + id, JSON.stringify({ hash: outreachOpeningHash_(opening), url: byId[id].url, slug: byId[id].slug, active: true }));
      } else if (opening.status === 'Paused') {
        var proof = outreachOpeningProof_(properties, id);
        if (proof) { proof.active = false; properties.setProperty('OUTREACH_OPENING_VERIFIED_' + id, JSON.stringify(proof)); }
      }
    });
    if (Object.keys(confirmedIds).length !== openings.length) allComplete = false;
    if (allComplete) {
      properties.setProperty('OUTREACH_OPENINGS_LAST_VERIFIED_INPUT', inputHash);
      properties.setProperty('OUTREACH_OPENINGS_LAST_VERIFIED_OUTPUT', outreachOpeningOutputHash_(confirmed));
    }
  } catch (error) {
    if (sheet && sheet.getLastRow() >= 2) {
      var current = sheet.getRange(2, 1, sheet.getLastRow() - 1, 22).getValues();
      current.forEach(function(row, index) {
        var opening = submitted[String(row[0] || '')];
        if (opening && JSON.stringify(outreachOpeningRow_(row)) === JSON.stringify(opening)) sheet.getRange(index + 2, 20).setValue('Sync error — ' + String(error.message || 'Retrying').slice(0, 180));
      });
    }
    throw error;
  } finally { lock.releaseLock(); }
}
