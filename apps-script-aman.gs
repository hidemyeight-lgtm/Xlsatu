/**
 * Google Apps Script yang diperkeras untuk form leads.
 * Cara pakai: Spreadsheet > Extensions > Apps Script (script harus terikat ke spreadsheet leads).
 * Ganti semua isi kode lama dengan ini, lalu Deploy > Manage deployments > Edit (ikon pensil)
 * > Version: New version > Deploy. URL /exec tetap sama, jadi index.html tidak perlu diubah.
 * Sheet bernama "Leads" dengan kolom: Waktu | Nama | WA | Alamat | Maps | Paket | Tanggal
 */
const SHEET_NAME = 'Leads';
const MAX = { nama: 100, wa: 20, alamat: 300, maps: 200, paket: 120, tanggal: 12 };
const MAPS_PREFIX = 'https://www.google.com/maps?q=';

function ok_() { return ContentService.createTextOutput('ok'); }

// Cegah formula injection (=IMPORTXML(...) dkk bisa mencuri isi sheet) dan batasi panjang
function clean_(v, max) {
  let t = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

function doGet() { return ok_(); } // tidak pernah mengembalikan data sheet

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.hp) return ok_();                 // honeypot terisi = bot
    if (!(Number(d.t) >= 4000)) return ok_(); // dikirim terlalu cepat = bot

    const wa = String(d.wa || '').replace(/[\s-]/g, '');
    if (!/^(\+62|62|0)8\d{8,12}$/.test(wa)) return ok_();

    const row = ['nama', 'wa', 'alamat', 'maps', 'paket', 'tanggal'].map(k => clean_(d[k], MAX[k]));
    row[1] = "'" + wa;                        // simpan sebagai teks
    if (row[3] && row[3].indexOf(MAPS_PREFIX) !== 0) row[3] = ''; // hanya link Google Maps

    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const n = sh.getLastRow();
    if (n > 1) {
      const recent = sh.getRange(Math.max(2, n - 49), 1, Math.min(50, n - 1), 3).getValues();
      const now = Date.now();
      const last10 = recent.filter(r => r[0] instanceof Date && now - r[0].getTime() < 600000);
      if (last10.length >= 30) return ok_();                                   // banjir: batasi 30 per 10 menit
      if (last10.some(r => String(r[2]).replace(/^'/, '') === wa)) return ok_(); // duplikat nomor
    }
    sh.appendRow([new Date()].concat(row));
    return ok_();
  } catch (err) {
    return ok_();
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}
