# Post Management Data — Website Starter

Paket ini berisi website company profile PMD dan backend Google Apps Script untuk portal upload tugas training.

## Struktur halaman

1. `index.html` — Company Profile / Home
2. `services.html` — Services & Products
3. `upload.html` — pintu masuk ke portal upload tugas
4. `training.html` — informasi Corporate Training
5. `portfolio.html` — contoh layout portfolio/demo
6. `contact.html` — kontak dan permintaan penawaran
7. `privacy.html` — draf informasi privasi

Backend ada di folder `apps-script/`:
- `Code.gs`
- `Upload.html`

## Penting sebelum digunakan

- Form upload sungguhan dilayani oleh Google Apps Script, bukan GitHub Pages. GitHub Pages hanya hosting statis, jadi tidak dapat menyimpan file peserta secara langsung.
- Jangan mengunggah file tugas peserta ke repository publik.
- Ganti placeholder email/WhatsApp di `contact.html`.
- Ganti URL website PMD di `apps-script/Upload.html` bila alamat website utama Anda berbeda.
- Silabus delapan sesi belum ditulis rinci karena materi final perlu dikonfirmasi.
- Kartu portfolio di halaman Portfolio adalah contoh layout dan harus diganti/ditandai sesuai proyek yang benar-benar ada.
- Tetapkan kebijakan retensi file dan siapa yang boleh mengakses folder tugas sebelum peserta mulai mengunggah.

## A. Siapkan Google Drive dan Google Sheets

1. Login ke akun Google milik Post Management Data.
2. Buat folder Drive, misalnya `PMD - Corporate Training Submissions`.
3. Di dalamnya, Apps Script akan membuat subfolder `Sesi 1` sampai `Sesi 8` secara otomatis saat file pertama untuk sesi tersebut diunggah.
4. Buat Google Spreadsheet, misalnya `PMD - Log Pengumpulan Tugas`.
5. Salin ID folder Drive dari URL folder. ID adalah bagian setelah `/folders/`.
6. Salin ID Spreadsheet dari URL di antara `/d/` dan `/edit`.

## B. Pasang Apps Script

1. Buka https://script.google.com/ dan buat project baru.
2. Salin isi `apps-script/Code.gs` ke file `Code.gs`.
3. Tambahkan file HTML baru bernama `Upload`, lalu salin isi `apps-script/Upload.html` ke dalamnya.
4. Di bagian atas `Code.gs`, ganti:
   - `GANTI_DENGAN_ID_FOLDER_DRIVE` dengan ID folder Drive.
   - `GANTI_DENGAN_ID_GOOGLE_SHEETS` dengan ID Spreadsheet.
5. Simpan project.
6. Pilih fungsi `setupSubmissionSheet` lalu klik **Run**. Berikan izin yang diminta. Pastikan tab `Submissions` dan header log dibuat di spreadsheet.
7. Klik **Deploy → New deployment**.
8. Pilih tipe **Web app**.
9. Atur **Execute as** menjadi akun Anda/pemilik project. Atur siapa yang dapat mengakses sesuai kebijakan akun dan perusahaan.
   - Jika pilihannya **Anyone**, orang yang memiliki link dapat mengakses form. Jangan gunakan ini untuk data sensitif tanpa kontrol tambahan.
   - Jika peserta memakai akun organisasi, pertimbangkan membatasi akses ke pengguna domain/akun yang sesuai, jika opsi tersedia.
10. Klik **Deploy**, selesaikan otorisasi, lalu salin URL Web App yang berakhiran `/exec`.
11. Uji upload menggunakan file latihan dummy terlebih dahulu. Pastikan file masuk ke subfolder sesi yang benar dan satu baris tercatat di tab `Submissions`.

## C. Hubungkan halaman Upload ke website

1. Buka `assets/js/main.js`.
2. Temukan baris `const UPLOAD_APP_URL = "";`.
3. Tempel URL Web App yang berakhiran `/exec` di antara tanda kutip.
4. Simpan perubahan, commit, dan push ke repository GitHub.
5. Buka halaman `upload.html` di website. Tombol **Buka Form Upload** akan muncul dan membuka form Apps Script.

## D. Publikasikan di GitHub Pages

1. Upload seluruh file dan folder paket ini ke repository GitHub Anda.
2. Pastikan `index.html` berada di root repository yang dipublikasikan.
3. Buka **Settings → Pages** pada repository.
4. Pilih branch yang dipakai (umumnya `main`) dan folder `/ (root)`, lalu simpan.
5. Buka URL GitHub Pages yang muncul.
6. Periksa seluruh tautan menu, tampilan ponsel, halaman Services, dan tombol Upload.

## E. Struktur log dan penyimpanan

- Drive: folder utama → subfolder per sesi → file peserta.
- Sheets `Submissions`: timestamp, sesi, nama, divisi, nama file, tipe file, ukuran, Drive File ID, status.

File tidak dibuat publik oleh script ini secara eksplisit. Tetap periksa pengaturan berbagi folder Drive agar hanya pihak berwenang yang memiliki akses.

## Batasan dan keamanan

- Ini starter untuk penggunaan awal, bukan sistem LMS lengkap.
- Form menggunakan validasi format dan batas ukuran 10 MB, tetapi validasi ekstensi bukan pemeriksaan keamanan konten file secara menyeluruh.
- Web App yang dapat diakses publik berpotensi menerima spam. Jika akan digunakan banyak peserta atau file perusahaan yang sensitif, tambahkan autentikasi/akses terbatas, batasan peserta, dan prosedur penghapusan.
- Tidak ada halaman admin publik dalam paket ini agar daftar peserta dan file tidak terbuka bagi semua pengunjung. Pengelola dapat memantau log dari Google Sheets dan file dari Drive.
- Jangan mengandalkan alamat URL sebagai satu-satunya bentuk pengamanan.
