module.exports = async (req, res) => {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = req.query.folderId;

  if (!apiKey) {
    res.status(500).json({ error: "GOOGLE_DRIVE_API_KEY tanımlı değil (Vercel Environment Variables)." });
    return;
  }

  if (!folderId) {
    res.status(400).json({ error: "folderId gerekli." });
    return;
  }

  const url =
    `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(folderId)}'+in+parents` +
    `+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType)`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Drive API isteği başarısız." });
  }
};
