/**
 * Paylaşılan içerik yardımcıları (about / projects JSON sayfaları).
 * JSON doğrudan GitHub'dan okunur — admin kayıtları deploy beklemez.
 */
window.SiteContent = (function () {
  const GITHUB_RAW_BASE =
    "https://raw.githubusercontent.com/EneSancar/nsancar-portfolio/refs/heads/main/htdocs/data";

  function toFileName(path) {
    return String(path || "")
      .replace(/^\/+/, "")
      .replace(/^data\//, "")
      .split("?")[0];
  }

  async function fetchJson(path) {
    const file = toFileName(path);
    const bust = Date.now();
    const sources = [
      `${GITHUB_RAW_BASE}/${file}?v=${bust}`,
      `/api/content?file=${encodeURIComponent(file)}&v=${bust}`,
      `${path.startsWith("/") ? path : `data/${file}`}?v=${bust}`,
    ];

    for (const url of sources) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) return res.json();
      } catch (_) {
        /* sonraki kaynak */
      }
    }

    throw new Error(`${file} yüklenemedi`);
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
