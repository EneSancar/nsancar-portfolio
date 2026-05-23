function getBearerToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim();
}

function isAuthorized(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const bearer = getBearerToken(req);
  if (bearer && bearer === secret) return true;
  const headerSecret = req.headers["x-admin-secret"];
  if (headerSecret && headerSecret === secret) return true;
  return false;
}

function sendUnauthorized(res) {
  res.status(401).json({
    error: "unauthorized",
    message: "Geçersiz veya eksik admin kimlik bilgisi.",
  });
}

module.exports = { isAuthorized, sendUnauthorized };
