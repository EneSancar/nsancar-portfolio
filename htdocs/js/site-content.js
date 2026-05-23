/**
 * Paylaşılan içerik yardımcıları (about / projects JSON sayfaları).
 */
window.SiteContent = (function () {
  async function fetchJson(path) {
    const url = `${path}${path.includes("?") ? "&" : "?"}v=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        resolve();
        return;
      }
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Görsel yüklenemedi"));
      img.src = src;
    });
  }

  function appendEmptyNotice(container, message) {
    const p = document.createElement("p");
    p.className = "content-empty";
    p.textContent = message;
    container.appendChild(p);
  }

  return { fetchJson, asArray, preloadImage, appendEmptyNotice };
})();
