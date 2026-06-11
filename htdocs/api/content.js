/**
 * Site JSON içeriğini doğrudan GitHub'dan okur.
 * GET /api/content?file=about.json
 */
const { readJsonFile } = require("./_lib/github");

const ALLOWED = new Set([
  "about.json",
  "projects.json",
  "activities.json",
  "video-edits.json",
]);

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
}

function noStore(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("CDN-Cache-Control", "no-store");
}

module.exports = async (req, res) => {
  setCors(res);
  noStore(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const file = String(req.query.file || "").trim();
  if (!file || !ALLOWED.has(file)) {
    res.status(400).json({
      error: "invalid_file",
      message: `Geçerli dosyalar: ${[...ALLOWED].join(", ")}`,
    });
    return;
  }

  const result = await readJsonFile(file);
  if (!result.ok) {
    res.status(result.status).json(result.body);
    return;
  }

  res.status(200).json(result.body);
};
