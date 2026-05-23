const { isAuthorized, sendUnauthorized, getAuthFailureReason } = require("./lib/auth");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Secret");
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!process.env.ADMIN_SECRET) {
    res.status(503).json({
      error: "server_not_configured",
      message:
        "Vercel'de ADMIN_SECRET ortam değişkeni tanımlı değil. Ayarlar → Environment Variables → redeploy.",
    });
    return;
  }

  if (!isAuthorized(req)) {
    const reason = getAuthFailureReason(req);
    res.status(401).json({
      error: "unauthorized",
      message: reason || "Geçersiz admin anahtarı. Vercel'deki ADMIN_SECRET ile aynı olmalı.",
    });
    return;
  }

  res.status(200).json({ ok: true });
};
