// Google Drive klasör ID (herkese açık paylaşım linkiyle uyumlu)
const folderId = "1Z-KsRAANfGu1AUdkkj36joR5rg-Zs4Op";

const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");

// API anahtarı sunucuda tutulur (/api/drive — Vercel env: GOOGLE_DRIVE_API_KEY)
async function loadImages() {
  const url = `/api/drive?folderId=${encodeURIComponent(folderId)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.files || data.files.length === 0) {
      gallery.innerHTML = "<p style='text-align:center;'>Bu klasörde henüz fotoğraf yok 📂</p>";
      loader.style.display = "none";
      return;
    }

    data.files.forEach(file => {
      const img = document.createElement("img");
      img.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
      img.alt = file.name;
      img.loading = "lazy"; // Lazy Load aktif
      gallery.appendChild(img);
    });

    loader.style.display = "none";
  } catch (err) {
    console.error("Drive API hatası:", err);
    gallery.innerHTML = "<p style='color:red;'>Fotoğraflar yüklenemedi ❌</p>";
    loader.style.display = "none";
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


// Başlat
loadImages();
