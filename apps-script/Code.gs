/**
 * POST MANAGEMENT DATA — PORTAL UPLOAD TUGAS
 * Sebelum deploy:
 * 1. Buat folder utama Google Drive.
 * 2. Buat Google Spreadsheet untuk log pengumpulan.
 * 3. Isi DRIVE_ROOT_FOLDER_ID dan SPREADSHEET_ID di bawah.
 * 4. Jalankan setupSubmissionSheet() satu kali dari editor Apps Script.
 */

const CONFIG = {
  DRIVE_ROOT_FOLDER_ID: "GANTI_DENGAN_ID_FOLDER_DRIVE",
  SPREADSHEET_ID: "GANTI_DENGAN_ID_GOOGLE_SHEETS",
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_EXTENSIONS: ["xlsx", "xls", "csv"]
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Upload")
    .setTitle("Upload Tugas Training | Post Management Data")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/** Jalankan satu kali dari editor Apps Script untuk membuat header log. */
function setupSubmissionSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Submissions");
  if (!sheet) sheet = ss.insertSheet("Submissions");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Sesi", "Nama Peserta", "Divisi",
      "Nama File", "Tipe File", "Ukuran (bytes)", "Drive File ID", "Status"
    ]);
    sheet.setFrozenRows(1);
  }
  return "Sheet Submissions siap digunakan.";
}

/**
 * Dipanggil dari halaman HTML menggunakan google.script.run.
 * File dikirim sebagai base64 setelah validasi sisi browser.
 */
function uploadSubmission(payload) {
  validateConfig_();
  if (!payload || typeof payload !== "object") throw new Error("Data pengumpulan tidak valid.");

  const session = String(payload.session || "").trim();
  const name = String(payload.name || "").trim();
  const division = String(payload.division || "").trim();
  const fileName = sanitizeFileName_(String(payload.fileName || "").trim());
  const mimeType = String(payload.mimeType || "application/octet-stream").trim();
  const base64 = String(payload.base64 || "").trim();

  if (!/^Sesi [1-8]$/.test(session)) throw new Error("Pilih sesi training 1 sampai 8.");
  if (!name || name.length > 100) throw new Error("Nama wajib diisi (maksimal 100 karakter).");
  if (!division || division.length > 100) throw new Error("Divisi wajib diisi (maksimal 100 karakter).");
  if (!fileName || !base64) throw new Error("File belum dipilih.");

  const extensionMatch = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  const extension = extensionMatch ? extensionMatch[1] : "";
  if (!CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error("Format file harus .xlsx, .xls, atau .csv.");
  }

  // Batasi ukuran payload sebelum decode untuk mengurangi risiko upload terlalu besar.
  const approximateBytes = Math.floor(base64.length * 3 / 4);
  const maxBytes = CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
  if (approximateBytes > maxBytes) {
    throw new Error("Ukuran file melebihi batas " + CONFIG.MAX_FILE_SIZE_MB + " MB.");
  }

  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > maxBytes) throw new Error("Ukuran file melebihi batas " + CONFIG.MAX_FILE_SIZE_MB + " MB.");

  const root = DriveApp.getFolderById(CONFIG.DRIVE_ROOT_FOLDER_ID);
  const sessionFolder = getOrCreateFolder_(root, session);
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = sessionFolder.createFile(blob);

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Submissions");
  if (!sheet) {
    setupSubmissionSheet();
    sheet = ss.getSheetByName("Submissions");
  }
  sheet.appendRow([
    new Date(), session, name, division, fileName, mimeType,
    bytes.length, file.getId(), "Uploaded"
  ]);

  return {
    success: true,
    message: "Tugas berhasil diunggah. Simpan nama file Anda sebagai referensi.",
    fileName: fileName,
    session: session
  };
}

function validateConfig_() {
  if (!CONFIG.DRIVE_ROOT_FOLDER_ID || CONFIG.DRIVE_ROOT_FOLDER_ID.indexOf("GANTI_") === 0) {
    throw new Error("Administrator belum mengatur ID folder Google Drive.");
  }
  if (!CONFIG.SPREADSHEET_ID || CONFIG.SPREADSHEET_ID.indexOf("GANTI_") === 0) {
    throw new Error("Administrator belum mengatur ID Google Sheets.");
  }
}

function getOrCreateFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function sanitizeFileName_(name) {
  return name.replace(/[\\/:*?"<>|#%{}[\]~]/g, "_").replace(/\s+/g, " ").slice(0, 150);
}
