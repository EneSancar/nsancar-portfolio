function getBearerToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim();
}

function getProvidedSecret(req) {
  const bearer = getBearerToken(req);
  if (bearer) return bearer;
  const headerSecret = req.headers["x-admin-secret"];
  if (headerSecret) return String(headerSecret).trim();
  return null;
}

function secretsMatch(provided, expected) {
  if (!provided || !expected) return false;
  if (provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

function isAuthorized(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const provided = getProvidedSecret(req);
  return secretsMatch(provided, secret.trim());
}

function getAuthFailureReason(req) {
  if (!process.env.ADMIN_SECRET) {
    return "Vercel'de ADMIN_SECRET tanımlı değil. Ortam değişkenlerini ekleyip projeyi yeniden deploy edin.";
  }
  if (!getProvidedSecret(req)) {
    return "Authorization başlığı gönderilmedi. Çıkış yapıp tekrar giriş yapın.";
  }
  return "Admin anahtarı yanlış. Vercel → ADMIN_SECRET ile girişte yazdığın değer birebir aynı olmalı (boşluk yok).";
}

function sendUnauthorized(res, req) {
  if (!process.env.ADMIN_SECRET) {
    res.status(503).json({
      error: "server_not_configured",
      message:
        "Vercel'de ADMIN_SECRET tanımlı değil. Settings → Environment Variables ekleyip Redeploy yapın.",
    });
    return;
  }

  res.status(401).json({
    error: "unauthorized",
    message: req ? getAuthFailureReason(req) : "Geçersiz veya eksik admin kimlik bilgisi.",
  });
}

module.exports = { isAuthorized, sendUnauthorized, getAuthFailureReason, getProvidedSecret };
