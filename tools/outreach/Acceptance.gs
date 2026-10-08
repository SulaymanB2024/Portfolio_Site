/** @OnlyCurrentDoc */
// One-time delivery proof: a Google Spreadsheet service API write does not fire onEdit.
// This function deliberately does not call either sync handler.
function appendScheduledAcceptanceCompany() {
  var workbook = SpreadsheetApp.getActiveSpreadsheet();
  if (!workbook || workbook.getId() !== OUTREACH_WORKBOOK_ID) throw new Error('Wrong workbook.');
  var sheet = workbook.getSheetByName(OUTREACH_SHEET);
  if (!sheet) throw new Error('Missing Portfolio Links.');
  var names = sheet.getRange(2, 1, Math.max(1, sheet.getLastRow() - 1), 1).getValues();
  if (names.some(function(row) { return String(row[0]).trim() === 'Boston Consulting Group'; })) throw new Error('The acceptance company already exists.');
  sheet.getRange(sheet.getLastRow() + 1, 1).setValue('Boston Consulting Group');
  SpreadsheetApp.flush();
  var addedAt = new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty('OUTREACH_ACCEPTANCE_ADDED_AT', addedAt);
  console.log('Boston Consulting Group added through the Spreadsheet service API at ' + addedAt + '. Wait for the scheduled trigger; do not run sync.');
}
