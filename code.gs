/**
 * GreenSteels – Enquiry form backend (Google Apps Script)
 *
 * Receives form data via GET (query string) and appends one row per
 * submission to a Google Sheet. GET is used so the site works from a
 * local file:// page with fetch(..., { mode: "no-cors" }).
 *
 * Expected query parameters:
 *   name, phone, email, product, quantity, unit, location
 */

// Leave empty if this script is bound to your spreadsheet
// (Extensions > Apps Script from inside the Sheet).
// Otherwise paste the Spreadsheet ID from the Sheet's URL.
const SPREADSHEET_ID = '';

const SHEET_NAME = 'Enquiries';

const HEADERS = [
  'Timestamp',
  'Full Name',
  'Phone',
  'Email',
  'Product Interested In',
  'Estimated Quantity',
  'Unit',
  'Delivery Location'
];

function doGet(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const p = (e && e.parameter) ? e.parameter : {};

    // Health check: opening the /exec URL in a browser with no params
    if (!p.name && !p.phone && !p.email) {
      return jsonOut({ result: 'ok', message: 'GreenSteels enquiry endpoint is live.' });
    }

    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      clean_(p.name),
      clean_(p.phone),
      clean_(p.email),
      clean_(p.product),
      clean_(p.quantity),
      clean_(p.unit),
      clean_(p.location)
    ]);

    return jsonOut({ result: 'success' });
  } catch (err) {
    return jsonOut({ result: 'error', message: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** Finds (or creates) the target sheet and makes sure headers exist. */
function getSheet_() {
  const ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Keep phone numbers as text so leading zeros / + signs are preserved
    sheet.getRange('C:C').setNumberFormat('@');
  }
  return sheet;
}

/** Trims input and neutralises spreadsheet formula injection. */
function clean_(value) {
  let v = (value === undefined || value === null) ? '' : String(value).trim();
  if (v.length > 2000) v = v.substring(0, 2000);
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Optional: run once from the editor to authorise the script and create the sheet. */
function setup() {
  getSheet_();
}
