const { isAuthorized, sendUnauthorized } = require("./lib/auth");
const { writeJsonFile } = require("./lib/github");
const { validateProjects } = require("./lib/validate");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Secret");
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed", message: "Yalnızca POST desteklenir." });
    return;
  }

  if (!isAuthorized(req)) {
    sendUnauthorized(res);
    return;
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      res.status(400).json({ error: "invalid_json", message: "Geçersiz JSON gövdesi." });
      return;
    }
  }
  const validationError = validateProjects(payload);
  if (validationError) {
    res.status(400).json({ error: "invalid_payload", message: validationError });
    return;
  }

  const result = await writeJsonFile("projects.json", payload, "admin: update projects.json");
  res.status(result.status).json(result.body);
};
