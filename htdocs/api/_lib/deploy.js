/**
 * Admin kayıtları GitHub API ile commit edilir; bazen Vercel otomatik deploy tetiklenmez.
 * VERCEL_DEPLOY_HOOK_URL tanımlıysa her başarılı kayıttan sonra deploy başlatır.
 */
async function triggerVercelDeploy() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return { triggered: false, reason: "no_hook_configured" };
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });
    if (!res.ok) {
      const message = await res.text().catch(() => "");
      return { triggered: false, reason: "hook_failed", status: res.status, message };
    }

    const data = await res.json().catch(() => ({}));
    return { triggered: true, job: data.job || data.id || null };
  } catch (err) {
    return { triggered: false, reason: "hook_error", message: err.message };
  }
}

module.exports = { triggerVercelDeploy };
