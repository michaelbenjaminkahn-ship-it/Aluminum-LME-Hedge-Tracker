/**
 * Excel Metals — Aluminium Hedge Tracker
 * Google Sheets backend (Apps Script web app).
 *
 * SETUP (see GOOGLE_SHEETS_SETUP.md for the click-by-click version):
 *   1. In your Google Sheet: Extensions → Apps Script.
 *   2. Delete any sample code, paste this whole file in, and Save.
 *   3. Change PASSCODE below to a shared passcode of your choosing.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *   5. Copy the Web app URL (ends in /exec) and give it + the passcode to the app.
 *
 * The app sends the passcode with every request; without it, nothing is returned.
 */

const SHEET_NAME = 'Hedges';
const PASSCODE   = 'change-me-to-a-shared-passcode';   // <-- set this

// Columns the app manages. You may ADD your own extra columns to the right;
// just don't rename or remove these, and never edit the "id" column by hand.
const FIELDS = ['id','tradeDate','side','lots','price','customer','po','prompt',
                'deliveryMonth','closePrice','venue','product','pricing','diff',
                'strike','unpriced','avgStart','avgEnd','status','notes','updatedAt'];

function doGet(e)  { return route_(parseGet_(e)); }
function doPost(e) { var p = {}; try { p = JSON.parse(e.postData.contents); } catch (err) {} return route_(p); }

function parseGet_(e) {
  var p = {};
  if (e && e.parameter) for (var k in e.parameter) p[k] = e.parameter[k];
  if (typeof p.row  === 'string') { try { p.row  = JSON.parse(p.row);  } catch (_) {} }
  if (typeof p.rows === 'string') { try { p.rows = JSON.parse(p.rows); } catch (_) {} }
  return p;
}

function route_(p) {
  if (String(p.token || '') !== PASSCODE) return out_({ error: 'bad passcode' });
  var action = p.action || 'list';

  if (action === 'list') {
    var sh = getSheet_(), map = headerMap_(sh);
    return out_({ rows: readAll_(sh, map) });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = getSheet_(), map = headerMap_(sh), width = sh.getLastColumn();
    var now = new Date().toISOString();

    if (action === 'add') {
      var id = Utilities.getUuid();
      writeRow_(sh, map, width, merge_(p.row, { id: id, updatedAt: now }), sh.getLastRow() + 1);
      return out_({ ok: true, id: id });
    }
    if (action === 'addMany') {
      var ids = [];
      (p.rows || []).forEach(function (row) {
        var nid = Utilities.getUuid(); ids.push(nid);
        writeRow_(sh, map, sh.getLastColumn(), merge_(row, { id: nid, updatedAt: now }), sh.getLastRow() + 1);
      });
      return out_({ ok: true, ids: ids });
    }
    if (action === 'update') {
      var r = rowFor_(sh, map, p.id);
      if (r < 0) return out_({ error: 'not found' });
      writeRow_(sh, map, width, merge_(p.row, { id: p.id, updatedAt: now }), r);
      return out_({ ok: true });
    }
    if (action === 'delete') {
      var rd = rowFor_(sh, map, p.id);
      if (rd < 0) return out_({ error: 'not found' });
      sh.deleteRow(rd);
      return out_({ ok: true });
    }
    if (action === 'clear') {
      if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
      return out_({ ok: true });
    }
    return out_({ error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- helpers ---------- */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, FIELDS.length).setValues([FIELDS]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, FIELDS.length).setFontWeight('bold');
  }
  return sh;
}
function headerMap_(sh) {
  var hdr = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var map = {};
  hdr.forEach(function (h, i) { map[String(h).trim()] = i; });
  FIELDS.forEach(function (f) {
    if (map[f] === undefined) {
      var col = sh.getLastColumn() + 1;
      sh.getRange(1, col).setValue(f).setFontWeight('bold');
      map[f] = col - 1;
    }
  });
  return map;
}
function readAll_(sh, map) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  var vals = sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
  var out = [];
  vals.forEach(function (r) {
    var id = r[map['id']];
    if (!id) return;
    var o = {};
    FIELDS.forEach(function (f) {
      var v = r[map[f]];
      if (v instanceof Date) v = Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      o[f] = v;
    });
    out.push(o);
  });
  return out;
}
function rowFor_(sh, map, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, map['id'] + 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}
function writeRow_(sh, map, width, obj, rowNum) {
  var existing = (rowNum <= sh.getLastRow())
    ? sh.getRange(rowNum, 1, 1, width).getValues()[0]
    : new Array(width).fill('');
  FIELDS.forEach(function (f) { if (obj[f] !== undefined) existing[map[f]] = obj[f]; });
  sh.getRange(rowNum, 1, 1, existing.length).setValues([existing]);
}
function merge_(a, b) {
  var o = {}, k;
  if (a) for (k in a) o[k] = a[k];
  if (b) for (k in b) o[k] = b[k];
  return o;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
