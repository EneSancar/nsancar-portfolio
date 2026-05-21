module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = req.query.folderId;

  if (!apiKey) {
    res.status(500).json({
      error: "missing_api_key",
      message: "GOOGLE_DRIVE_API_KEY Vercel ortam değişkeni tanımlı değil.",
    });
    return;
  }

  if (!folderId) {
    res.status(400).json({ error: "missing_folder_id", message: "folderId gerekli." });
    return;
  }

  const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;
  const url =
    `https://www.googleapis.com/drive/v3/files?` +
    `q=${encodeURIComponent(query)}` +
    `&key=${apiKey}` +
    `&fields=files(id,name,mimeType)` +
    `&orderBy=createdTime desc` +
    `&pageSize=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: "drive_api_error",
        message: data.error?.message || "Google Drive API hatası",
        details: data,
      });
      return;
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(data);
  } catch {
    res.status(500).json({
      error: "server_error",
      message: "Drive API isteği başarısız.",
    });
  }
};
