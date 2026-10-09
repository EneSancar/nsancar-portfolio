// Google Drive klasör ID (klasör "Bağlantıya sahip olan herkes" görüntüleyebilir olmalı)
const folderId = "1Z-KsRAANfGu1AUdkkj36joR5rg-Zs4Op";

const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");

function showGalleryError(message) {
  gallery.innerHTML = `<p class="gallery-error">${message}</p>`;
  loader.style.display = "none";
}

function renderImages(files) {
  gallery.innerHTML = "";
  files.forEach((file) => {
    const img = document.createElement("img");
    img.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
    img.alt = file.name || "Galeri fotoğrafı";
    img.loading = "lazy";
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    gallery.appendChild(img);
  });
  loader.style.display = "none";
}

async function loadImages() {
  const apiUrl = `/api/drive?folderId=${encodeURIComponent(folderId)}`;

  try {
    const res = await fetch(apiUrl);
    let data;

    try {
      data = await res.json();
    } catch {
      showGalleryError("Galeri servisi yanıt vermedi. Vercel deploy ve /api/drive yolunu kontrol et.");
      return;
    }

    if (!res.ok) {
      if (data.error === "missing_api_key") {
        showGalleryError(
          "Drive API anahtarı tanımlı değil. Vercel → Settings → Environment Variables → GOOGLE_DRIVE_API_KEY ekle ve yeniden deploy et."
        );
        return;
      }
      console.error("Drive API:", data);
      showGalleryError("Fotoğraflar yüklenemedi. API anahtarı veya Drive klasör paylaşımını kontrol et.");
      return;
    }

    if (!data.files || data.files.length === 0) {
      showGalleryError("Bu klasörde görüntülenecek fotoğraf bulunamadı.");
      return;
    }

    renderImages(data.files);
  } catch (err) {
    console.error("Drive API hatası:", err);
    showGalleryError("Fotoğraflar yüklenemedi. İnternet bağlantını veya site deploy ayarlarını kontrol et.");
  }
}

// Modal açma/kapatma
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");

let lastFocused = null;

function openModal(img) {
  lastFocused = img;
  modal.style.display = "block";
  modalImg.src = img.src;
  modalImg.alt = img.alt || "Galeri fotoğrafı";
  closeBtn.focus();
}

function closeModal() {
  modal.style.display = "none";
  modalImg.removeAttribute("src");
  modalImg.alt = "";
  if (lastFocused) lastFocused.focus();
}

gallery.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") openModal(e.target);
});

// Klavyeyle gezinme: Enter veya Bosluk ile buyut
gallery.addEventListener("keydown", (e) => {
  if (e.target.tagName !== "IMG") return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openModal(e.target);
  }
});

closeBtn.onclick = closeModal;
modal.onclick = (e) => {
  if (e.target === modal) closeModal();
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "block") closeModal();
});

loadImages();
