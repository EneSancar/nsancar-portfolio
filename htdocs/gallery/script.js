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

gallery.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    modal.style.display = "block";
    modalImg.src = e.target.src;
  }
});

closeBtn.onclick = () => (modal.style.display = "none");
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

loadImages();
