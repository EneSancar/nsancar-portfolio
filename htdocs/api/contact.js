export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, subject, message, _honey } = req.body || {};

  if (_honey) return res.status(200).json({ ok: true }); // spam trap

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Eksik alan" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Geçersiz e-posta" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "enes.sancar2@gmail.com";

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Mail servisi yapılandırılmamış" });
  }

  const subjectLine = subject ? `[nsancar.com] ${subject}` : `[nsancar.com] Yeni mesaj — ${name}`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#0c0e14;color:#e8eaef;padding:2rem;border-radius:12px;border:1px solid rgba(99,102,241,0.2)">
      <h2 style="margin:0 0 1.5rem;color:#818cf8">Yeni iletişim formu mesajı</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:0.5rem 0;color:#9aa3b5;width:100px">Ad</td><td style="padding:0.5rem 0;font-weight:600">${escHtml(name)}</td></tr>
        <tr><td style="padding:0.5rem 0;color:#9aa3b5">E-posta</td><td style="padding:0.5rem 0"><a href="mailto:${escHtml(email)}" style="color:#818cf8">${escHtml(email)}</a></td></tr>
        ${subject ? `<tr><td style="padding:0.5rem 0;color:#9aa3b5">Konu</td><td style="padding:0.5rem 0">${escHtml(subject)}</td></tr>` : ""}
      </table>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:1.25rem 0">
      <p style="white-space:pre-wrap;line-height:1.7;margin:0">${escHtml(message)}</p>
      <p style="margin:1.5rem 0 0;font-size:0.8rem;color:#525870">nsancar.com iletişim formu · ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
    </div>
  `;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "nsancar.com <onboarding@resend.dev>",
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: subjectLine,
        html,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({ error: "Mail gönderilemedi" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact API error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}

function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
