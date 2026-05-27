function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function pickMeta(html, prop) {
  const re1 = new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${prop}["']`, "i");
  const re3 = new RegExp(`<meta\\s+name=["']${prop}["']\\s+content=["']([^"']+)["']`, "i");
  return html.match(re1)?.[1] || html.match(re2)?.[1] || html.match(re3)?.[1] || null;
}

function normalizeSpotifyUrl(input) {
  // /intl-tr/, /intl-en/ vs. lokalizasyon prefix'lerini sil
  const url = new URL(input);
  url.pathname = url.pathname.replace(/^\/intl-[a-z]{2,3}\//i, "/");
  url.search = "";
  url.hash = "";
  return url;
}

async function fetchOEmbed(canonicalUrl) {
  const oembed = `https://open.spotify.com/oembed?url=${encodeURIComponent(canonicalUrl)}`;
  const res = await fetch(oembed, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

async function fetchHtml(canonicalUrl) {
  const res = await fetch(canonicalUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!res.ok) return null;
  return res.text();
}

function parseTitleAndArtistFromHtml(html) {
  let title = pickMeta(html, "og:title");
  const ogDesc = pickMeta(html, "og:description");
  const twTitle = pickMeta(html, "twitter:title");
  const twDesc = pickMeta(html, "twitter:description");
  const ogImage = pickMeta(html, "og:image") || pickMeta(html, "twitter:image");

  let artist = null;

  // og:description: "Song · Kid Cudi · 2008 · 3:43" veya
  //                 "Listen to TITLE on Spotify. Kid Cudi · Song · 2008 · 3:43"
  const desc = ogDesc || twDesc;
  if (desc) {
    // Önce "Listen to X on Spotify." prefix'ini at
    const cleaned = desc.replace(/^Listen to .+? on Spotify\.?\s*/i, "");
    const parts = cleaned.split("·").map(s => s.trim()).filter(Boolean);
    // Yıl, süre, ve "Song/Şarkı" kelimelerini ele
    const candidate = parts.find(p =>
      !/^song$/i.test(p) &&
      !/^şarkı$/i.test(p) &&
      !/^single$/i.test(p) &&
      !/^album$/i.test(p) &&
      !/^\d{4}$/.test(p) &&
      !/^\d+:\d+$/.test(p)
    );
    if (candidate) artist = candidate;
  }

  const rawTitle = title || twTitle || "";
  // "Day 'n' Nite - song and lyrics by Kid Cudi | Spotify" gibi tüm temizlikler
  const byMatch = rawTitle.match(/\s*[—–-]\s*(?:song(?:\s+and\s+lyrics)?\s+by\s+)([^|]+?)(?:\s*\|.*)?$/i);
  if (byMatch && !artist) artist = byMatch[1].trim();

  const cleanTitle = rawTitle
    .replace(/\s*[—–-]\s*song(?:\s+and\s+lyrics)?\s+by\s+.*$/i, "")
    .replace(/\s*\|\s*Spotify\s*$/i, "")
    .trim();

  return {
    title: cleanTitle || null,
    artist: artist || null,
    image: ogImage || null,
  };
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "url parametresi gerekli." });
    return;
  }

  let canonical;
  try {
    canonical = normalizeSpotifyUrl(url);
  } catch {
    res.status(400).json({ error: "Geçersiz URL." });
    return;
  }

  const allowed = ["open.spotify.com", "spotify.com"];
  if (!allowed.includes(canonical.hostname)) {
    res.status(400).json({ error: "Yalnızca Spotify URL'leri destekleniyor." });
    return;
  }

  const canonicalStr = canonical.toString();
  let title = null, artist = null, image = null;
  const debug = { canonical: canonicalStr, sources: [] };

  // 1) oEmbed dene — image + title için en güvenilir
  try {
    const oembed = await fetchOEmbed(canonicalStr);
    if (oembed) {
      debug.sources.push("oembed");
      if (oembed.title) title = oembed.title;
      if (oembed.thumbnail_url) image = oembed.thumbnail_url;
    }
  } catch (e) {
    debug.oembedError = e.message;
  }

  // 2) HTML scraping — artist + title eksiklerini doldurmak için
  try {
    const html = await fetchHtml(canonicalStr);
    if (html) {
      debug.sources.push("html");
      const parsed = parseTitleAndArtistFromHtml(html);
      if (!title  && parsed.title)  title  = parsed.title;
      if (!artist && parsed.artist) artist = parsed.artist;
      if (!image  && parsed.image)  image  = parsed.image;
    }
  } catch (e) {
    debug.htmlError = e.message;
  }

  if (!title && !artist && !image) {
    res.status(404).json({
      error: "Track verisi okunamadı.",
      hint: "URL'in /track/... formatında olduğundan emin olun.",
      debug,
    });
    return;
  }

  res.status(200).json({
    title,
    artist,
    image,
    debug, // ileride kaldırılabilir
  });
};
