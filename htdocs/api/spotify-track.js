function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function pickMeta(html, prop) {
  const re1 = new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${prop}["']`, "i");
  return html.match(re1)?.[1] || html.match(re2)?.[1] || null;
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "url parametresi gerekli." });
    return;
  }

  let target;
  try {
    target = new URL(url);
  } catch {
    res.status(400).json({ error: "Geçersiz URL." });
    return;
  }

  const allowed = ["open.spotify.com", "spotify.com"];
  if (!allowed.includes(target.hostname)) {
    res.status(400).json({ error: "Yalnızca Spotify URL'leri destekleniyor." });
    return;
  }

  try {
    const response = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      res.status(502).json({ error: `Spotify ${response.status} döndürdü.` });
      return;
    }

    const html = await response.text();

    const ogTitle = pickMeta(html, "og:title");
    const ogImage = pickMeta(html, "og:image");
    const ogDesc  = pickMeta(html, "og:description");
    const ogType  = pickMeta(html, "og:type");

    let title = ogTitle;
    let artist = null;

    // og:description formatı: "Song · Kid Cudi · 2008 · 3:43"
    // veya:                   "Listen to Day 'n' Nite on Spotify. Kid Cudi · Song · 2008."
    if (ogDesc) {
      // 1) "Song · Artist · ..." formatı
      const parts = ogDesc.split("·").map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        // Genelde [Tür, Sanatçı, Yıl, Süre] sırası
        const candidate = parts.find(p =>
          !/^song$/i.test(p) && !/^şarkı$/i.test(p) && !/^\d{4}$/.test(p) && !/^\d+:\d+$/.test(p)
        );
        if (candidate) artist = candidate;
      }
      // 2) "Listen to TITLE on Spotify. ARTIST · ..." formatı (fallback)
      if (!artist) {
        const m = ogDesc.match(/on Spotify\.?\s*([^·.]+)/i);
        if (m) artist = m[1].trim();
      }
    }

    // og:title temizliği: "Day 'n' Nite - song and lyrics by Kid Cudi | Spotify"
    if (title) {
      // "- song and lyrics by Artist" varsa sanatçıyı oradan da alabiliriz
      const byMatch = title.match(/\s*[—–-]\s*(?:song(?:\s+and\s+lyrics)?\s+by\s+)([^|]+?)(?:\s*\|.*)?$/i);
      if (byMatch && !artist) artist = byMatch[1].trim();
      title = title
        .replace(/\s*[—–-]\s*song(?:\s+and\s+lyrics)?\s+by\s+.*$/i, "")
        .replace(/\s*\|\s*Spotify\s*$/i, "")
        .trim();
    }

    if (!title && !ogImage) {
      res.status(404).json({ error: "Track verisi okunamadı." });
      return;
    }

    res.status(200).json({
      title: title || null,
      artist: artist || null,
      image: ogImage || null,
      type: ogType || null,
    });
  } catch (err) {
    res.status(500).json({ error: `Fetch hatası: ${err.message}` });
  }
};
