/**
 * Paylaşılan içerik yardımcıları (about / projects JSON sayfaları).
 */
window.SiteContent = (function () {
  const JSON_CACHE_TTL_MS = 2 * 60 * 1000;
  const jsonCache = new Map();

  async function fetchJson(path) {
    const key = path.split("?")[0];
    const cached = jsonCache.get(key);
    if (cached && Date.now() - cached.at < JSON_CACHE_TTL_MS) {
      return cached.data;
    }

    const bustUrl = `${key}?v=${Date.now()}`;
    const res = await fetch(bustUrl, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    jsonCache.set(key, { data, at: Date.now() });
    return data;
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
      img.decoding = "async";
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
