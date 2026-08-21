/**
 * KIOSK Agency — lead capture.
 *
 * Receives every inquiry from kioskoman.com and appends it to this sheet.
 * Bound to the spreadsheet it writes into, deployed as a Web App.
 *
 * The site posts straight from the browser, so this runs as a public endpoint.
 * See SECRET below for what that does and does not protect.
 */

/* ------------------------------------------------------------------ config */

/** Tab the rows land in. Created automatically if it is missing. */
var SHEET_NAME = 'Leads';

/**
 * Shared token. The site sends it with every submission and anything without
 * it is rejected.
 *
 * Be clear about what this is: the site is a static page, so this value ships
 * inside the JavaScript and anyone can read it. It stops drive-by bots hitting
 * a naked endpoint, it is not authentication. Rotate it here and in the site's
 * NEXT_PUBLIC_SHEET_TOKEN together whenever you want.
 *
 * Leave it as '' to accept everything.
 */
var SECRET = 'kiosk-2026';

/** Address that gets a copy of each lead. Set to '' to turn notices off. */
var NOTIFY = 'info@kioskoman.com';

/** Columns, in order. Add one here and it starts filling from the next lead. */
var COLUMNS = [
  'Received',
  'Name',
  'Phone',
  'Email',
  'Scope of work',
  'Message',
  'Form',
  'Page',
  'Referrer',
  'UTM source',
  'UTM medium',
  'UTM campaign',
  'UTM term',
  'UTM content',
  'Language',
  'Screen',
  'User agent',
];

/* ------------------------------------------------------------- entry point */

function doPost(e) {
  try {
    var data = parseBody(e);

    // Honeypot: a field no human ever sees, so anything in it is a bot.
    // Answer 200 so the bot believes it worked and does not retry.
    if (data.company_website) return json({ ok: true, skipped: 'honeypot' });

    if (SECRET && data.token !== SECRET) {
      return json({ ok: false, error: 'bad token' });
    }
    if (!String(data.name || '').trim()) {
      return json({ ok: false, error: 'name is required' });
    }
    if (!String(data.phone || '').trim() && !String(data.email || '').trim()) {
      return json({ ok: false, error: 'a phone number or an email is required' });
    }

    var row = appendLead(data);
    if (NOTIFY) notify(data, row);
    return json({ ok: true, row: row });
  } catch (err) {
    // Never throw at the browser: log it here and let the site fall through to
    // its WhatsApp path so the lead is not lost while this is being fixed.
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

/** Open the deployment URL in a browser to check it is alive. */
function doGet() {
  var sheet = getSheet();
  return json({
    ok: true,
    service: 'KIOSK lead capture',
    sheet: sheet.getName(),
    leads: Math.max(0, sheet.getLastRow() - 1),
  });
}

/* ---------------------------------------------------------------- internals */

function parseBody(e) {
  // The site posts JSON as text/plain, which is a "simple" request and so
  // never triggers a CORS preflight. Apps Script cannot answer a preflight,
  // so this is the reason the content type looks wrong.
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // fall through to form-encoded
    }
  }
  return (e && e.parameter) || {};
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    var header = sheet.getRange(1, 1, 1, COLUMNS.length);
    header.setFontWeight('bold').setBackground('#111110').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 150); // Received
    sheet.setColumnWidth(5, 260); // Scope
    sheet.setColumnWidth(6, 320); // Message
  }
  return sheet;
}

function appendLead(data) {
  // Two people can submit in the same second; the lock keeps the rows apart.
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet();
    var scope = Array.isArray(data.scope) ? data.scope.join(', ') : data.scope || '';
    var values = [
      new Date(),
      data.name || '',
      // Leading apostrophe, or Sheets eats the + and reads +968… as a formula.
      data.phone ? "'" + String(data.phone).trim() : '',
      data.email || '',
      scope,
      data.message || '',
      data.form || 'inquiry',
      data.page || '',
      data.referrer || '',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || '',
      data.utm_term || '',
      data.utm_content || '',
      data.language || '',
      data.screen || '',
      data.userAgent || '',
    ];
    sheet.appendRow(values);
    return sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }
}

function notify(data, row) {
  var scope = Array.isArray(data.scope) ? data.scope.join(', ') : data.scope || '';
  var lines = [
    'Name: ' + (data.name || ''),
    'Phone: ' + (data.phone || ''),
    'Email: ' + (data.email || ''),
    'Scope: ' + (scope || 'not specified'),
    'Message: ' + (data.message || ''),
    '',
    'Form: ' + (data.form || 'inquiry'),
    'Page: ' + (data.page || ''),
    'Campaign: ' + [data.utm_source, data.utm_medium, data.utm_campaign]
      .filter(String).join(' / '),
    '',
    'Row ' + row + ' in ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ];
  MailApp.sendEmail({
    to: NOTIFY,
    subject: 'New inquiry: ' + (data.name || 'unnamed') +
             (scope ? ' (' + scope + ')' : ''),
    body: lines.join('\n'),
    replyTo: data.email || undefined,
  });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------- tests */

/**
 * Run this once from the editor to prove the sheet, the headers and the
 * notification all work before pointing the site at it. It writes one row you
 * can then delete.
 */
function testAppend() {
  var row = appendLead({
    name: 'Test lead',
    phone: '+968 9000 0000',
    email: 'test@example.com',
    scope: ['Performance ads', 'Web & CRM'],
    message: 'Written by testAppend, safe to delete.',
    form: 'test',
    page: '/',
    utm_source: 'manual',
  });
  console.log('wrote row ' + row);
}
