(function () {
  const SESSION_KEY = "nsancar_admin_secret";

  const loginView = document.getElementById("loginView");
  const editorView = document.getElementById("editorView");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const contentSelect = document.getElementById("contentSelect");
  const jsonEditor = document.getElementById("jsonEditor");
  const reloadBtn = document.getElementById("reloadBtn");
  const saveBtn = document.getElementById("saveBtn");
  const statusEl = document.getElementById("adminStatus");
  const loginStatusEl = document.getElementById("loginStatus");
  const tabButtons = document.querySelectorAll("[data-tab]");

  const AUTH_CHECK = "/api/auth-check";

  const endpoints = {
    about: { file: "data/about.json", api: "/api/about" },
    projects: { file: "data/projects.json", api: "/api/projects" },
  };

  function authHeaders(secret) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
      "X-Admin-Secret": secret,
    };
  }

  async function verifySecret(secret) {
    const res = await fetch(AUTH_CHECK, {
      method: "GET",
      headers: authHeaders(secret),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true };
    return {
      ok: false,
      message: data.message || `Sunucu yanıtı: HTTP ${res.status}`,
    };
  }

  function getSecret() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  function setSecret(value) {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function showStatus(message, ok, target) {
    const el = target || statusEl;
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
    el.className = `admin-status ${ok ? "admin-status--ok" : "admin-status--err"}`;
  }

  function clearStatus() {
    [statusEl, loginStatusEl].forEach((el) => {
      if (!el) return;
      el.hidden = true;
      el.textContent = "";
    });
  }

  function showEditor() {
    loginView.hidden = true;
    editorView.hidden = false;
    loadCurrentJson();
  }

  function showLogin() {
    loginView.hidden = false;
    editorView.hidden = true;
    clearStatus();
  }

  async function loadCurrentJson() {
    const key = contentSelect.value;
    const { file } = endpoints[key];
    clearStatus();
    jsonEditor.value = "Yükleniyor…";

    try {
      const res = await fetch(`../${file}?v=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      jsonEditor.value = JSON.stringify(data, null, 2);
    } catch (err) {
      jsonEditor.value = "";
      showStatus(`JSON yüklenemedi: ${err.message}`, false);
    }
  }

  async function saveJson() {
    const key = contentSelect.value;
    const { api } = endpoints[key];
    const secret = getSecret();

    if (!secret) {
      showStatus("Oturum süresi doldu. Tekrar giriş yapın.", false);
      showLogin();
      return;
    }

    let payload;
    try {
      payload = JSON.parse(jsonEditor.value);
    } catch {
      showStatus("Geçersiz JSON. Lütfen sözdizimini kontrol edin.", false);
      return;
    }

    saveBtn.disabled = true;
    clearStatus();

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: authHeaders(secret),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`);
      }

      showStatus(
        "Kaydedildi. Vercel deploy başladıysa site ~30 sn içinde güncellenir." +
          (data.commit ? ` (commit: ${data.commit.slice(0, 7)})` : ""),
        true
      );
    } catch (err) {
      showStatus(`Kayıt başarısız: ${err.message}`, false);
    } finally {
      saveBtn.disabled = false;
    }
  }

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const secret = document.getElementById("adminSecret").value.trim();
    if (!secret) return;

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    showStatus("Anahtar doğrulanıyor…", true, loginStatusEl);

    const check = await verifySecret(secret);
    if (submitBtn) submitBtn.disabled = false;

    if (!check.ok) {
      showStatus(check.message, false, loginStatusEl);
      return;
    }

    setSecret(secret);
    clearStatus();
    showEditor();
  });

  logoutBtn?.addEventListener("click", () => {
    setSecret(null);
    showLogin();
  });

  contentSelect?.addEventListener("change", loadCurrentJson);
  reloadBtn?.addEventListener("click", loadCurrentJson);
  saveBtn?.addEventListener("click", saveJson);

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      contentSelect.value = btn.dataset.tab;
      loadCurrentJson();
    });
  });

  if (getSecret()) showEditor();
  else showLogin();
})();
