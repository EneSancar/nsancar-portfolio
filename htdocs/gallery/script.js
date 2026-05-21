// --- Google Drive ayarları ---
const folderId = "1Z-KsRAANfGu1AUdkkj36joR5rg-Zs4Op";
const apiKey = "AIzaSyDvUwAYMeBtp5QoxgMh1tqqKvqSPIQWRaE";

const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");

// Google Drive API'den dosya listesi çek
async function loadImages() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType)`;

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
