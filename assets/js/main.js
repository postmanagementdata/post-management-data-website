// Ubah nilai ini menjadi URL Web App Google Apps Script setelah deployment.
// Contoh format URL: https://script.google.com/macros/s/AKfycb.../exec
const UPLOAD_APP_URL = "";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    });
  }

  const message = document.getElementById("upload-embed-message");
  const openLink = document.getElementById("open-upload-app");
  if (message && openLink) {
    if (UPLOAD_APP_URL.trim()) {
      message.textContent = "Portal upload sudah terhubung. Klik tombol di bawah untuk membuka form pengumpulan tugas.";
      openLink.href = UPLOAD_APP_URL;
      openLink.hidden = false;
    } else {
      message.textContent = "Portal upload belum dikonfigurasi. Setelah Web App Google Apps Script dibuat, tempel URL-nya di variabel UPLOAD_APP_URL pada assets/js/main.js.";
    }
  }
});
