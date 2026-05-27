function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "url parametresi gerekli." });
    return;
  }

  let targetUrl;
  try {
    targetUrl = new URL(url);
  } catch {
    res.status(400).json({ error: "Geçersiz URL." });
    return;
  }

  const allowed = ["youtube.com", "www.youtube.com", "youtu.be"];
  if (!allowed.includes(targetUrl.hostname)) {
    res.status(400).json({ error: "Yalnızca YouTube URL'leri destekleniyor." });
    return;
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      res.status(502).json({ error: `YouTube ${response.status} döndürdü.` });
      return;
    }

    const html = await response.text();

    const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1]
      || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i)?.[1];

    if (!ogImage) {
      res.status(404).json({ error: "Avatar bulunamadı." });
      return;
    }

    res.status(200).json({ avatar: ogImage });
  } catch (err) {
    res.status(500).json({ error: `Fetch hatası: ${err.message}` });
  }
};
