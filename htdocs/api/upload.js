const { isAuthorized, sendUnauthorized } = require("./lib/auth");
const { writeSiteFile } = require("./lib/github");

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_EXT = /\.(jpe?g|png|webp|gif|svg)$/i;
const ALLOWED_PREFIX = /^(image\/|image\/projects\/)/;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Secret");
}

function sanitizePath(input) {
  const path = String(input || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  if (!path || path.includes("..") || !ALLOWED_PREFIX.test(path) || !ALLOWED_EXT.test(path)) {
    return null;
  }
  return path;
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!isAuthorized(req)) {
    sendUnauthorized(res, req);
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "invalid_json" });
      return;
    }
  }

  const relPath = sanitizePath(body.path);
  if (!relPath) {
    res.status(400).json({
      error: "invalid_path",
      message: "Geçersiz dosya yolu. image/ veya image/projects/ altında jpg, png, webp, gif veya svg kullanın.",
    });
    return;
  }

  let base64 = String(body.contentBase64 || "").trim();
  if (base64.includes(",")) base64 = base64.split(",").pop();

  if (!base64) {
    res.status(400).json({ error: "missing_content", message: "Dosya içeriği eksik." });
    return;
  }

  const bytes = Buffer.from(base64, "base64").length;
  if (bytes > MAX_BYTES) {
    res.status(400).json({ error: "file_too_large", message: "Dosya en fazla 4 MB olabilir." });
    return;
  }

  const result = await writeSiteFile(relPath, base64, `admin: upload ${relPath}`);
  if (!result.ok) {
    res.status(result.status).json(result.body);
    return;
  }

  res.status(200).json({
    ok: true,
    path: relPath,
    commit: result.body.commit,
  });
};
