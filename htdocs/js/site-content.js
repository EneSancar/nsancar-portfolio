/**
 * Paylaşılan içerik yardımcıları (about / projects JSON sayfaları).
 * JSON doğrudan GitHub'dan okunur — admin kayıtları deploy beklemez.
 */
window.SiteContent = (function () {
  const REPO = "EneSancar/nsancar-portfolio";
  const DATA_PREFIX = "htdocs/data";

  function toFileName(path) {
    return String(path || "")
      .replace(/^\/+/, "")
      .replace(/^data\//, "")
      .split("?")[0];
  }

  function isLocalHost() {
    const h = location.hostname;
    return h === "localhost" || h === "127.0.0.1";
  }

  async function fetchJson(path) {
    const file = toFileName(path);
    const bust = Date.now();
    const sources = [
      `https://cdn.jsdelivr.net/gh/${REPO}@main/${DATA_PREFIX}/${file}?v=${bust}`,
      `https://raw.githubusercontent.com/${REPO}/refs/heads/main/${DATA_PREFIX}/${file}?v=${bust}`,
      `/api/content?file=${encodeURIComponent(file)}&v=${bust}`,
    ];

    if (isLocalHost()) {
      sources.push(`${path.startsWith("/") ? path : `data/${file}`}?v=${bust}`);
    }

    let lastError = null;
    for (const url of sources) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) return res.json();
        lastError = new Error(`HTTP ${res.status} — ${url}`);
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error(`${file} yüklenemedi`);
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
