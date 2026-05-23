window.AdminCore = (function () {
  const SESSION_KEY = "nsancar_admin_secret";
  const AUTH_CHECK = "/api/auth-check";

  const endpoints = {
    about: { file: "data/about.json", api: "/api/about", title: "Hakkımda" },
    projects: { file: "data/projects.json", api: "/api/projects", title: "Projeler" },
  };

  const BACKUP_KEY = "nsancar_admin_about_backup";
  const BACKUP_AT_KEY = "nsancar_admin_about_backup_at";

  const state = {
    tab: "about",
    about: null,
    projects: null,
    lastLoadUsedBackup: false,
  };

  function authHeaders(secret) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
      "X-Admin-Secret": secret,
    };
  }

  function getSecret() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  function setSecret(value) {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  }

  async function verifySecret(secret) {
    const res = await fetch(AUTH_CHECK, {
      method: "GET",
      headers: authHeaders(secret),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true };
    return { ok: false, message: data.message || `HTTP ${res.status}` };
  }

  async function fetchJson(file) {
    const res = await fetch(`../${file}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function readAboutBackup() {
    try {
      const raw = sessionStorage.getItem(BACKUP_KEY);
      const at = Number(sessionStorage.getItem(BACKUP_AT_KEY) || 0);
      if (!raw || !at) return null;
      if (Date.now() - at > 15 * 60 * 1000) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function writeAboutBackup(data) {
    sessionStorage.setItem(BACKUP_KEY, JSON.stringify(data));
    sessionStorage.setItem(BACKUP_AT_KEY, String(Date.now()));
  }

  function shouldPreferBackup(fetched, backup) {
    if (!backup || !fetched) return false;
    const fields = ["education", "experience"];
    return fields.some((key) => {
      const a = Array.isArray(backup[key]) ? backup[key].length : 0;
      const b = Array.isArray(fetched[key]) ? fetched[key].length : 0;
      return a > b;
    });
  }

  async function loadAll() {
    const [about, projects] = await Promise.all([
      fetchJson(endpoints.about.file),
      fetchJson(endpoints.projects.file),
    ]);

    state.lastLoadUsedBackup = false;
    const backup = readAboutBackup();
    if (backup && shouldPreferBackup(about, backup)) {
      state.about = backup;
      state.lastLoadUsedBackup = true;
    } else {
      state.about = about;
    }
    state.projects = projects;
    return state;
  }

  function normalizeAboutPayload(payload) {
    const data = JSON.parse(JSON.stringify(payload));
    data.profile = data.profile || {};
    data.profile.social = Array.isArray(data.profile.social) ? data.profile.social : [];
    data.education = Array.isArray(data.education) ? data.education : [];
    data.experience = Array.isArray(data.experience) ? data.experience : [];
    data.skills = Array.isArray(data.skills) ? data.skills : [];
    data.interests = Array.isArray(data.interests) ? data.interests : [];

    data.education.forEach((edu, i) => {
      if (!edu.id) edu.id = `edu-${i}-${Date.now()}`;
      if (typeof edu.school === "string") edu.school = edu.school.trim();
      if (typeof edu.period === "string") edu.period = edu.period.trim();
      if (typeof edu.location === "string") edu.location = edu.location.trim();
      if (typeof edu.department === "string") edu.department = edu.department.trim();
    });
    data.experience.forEach((exp, i) => {
      if (!exp.id) exp.id = `exp-${i}-${Date.now()}`;
    });

    return data;
  }

  function cleanProjectsPayload(payload) {
    const data = JSON.parse(JSON.stringify(payload));
    data.sections = Array.isArray(data.sections) ? data.sections : [];
    data.projects = Array.isArray(data.projects) ? data.projects : [];
    data.hero = data.hero || { label: "", title: "", subtitle: "" };

    data.projects.forEach((p) => {
      if (!p.thumbnail) p.thumbnail = { type: "img", src: "", alt: "" };
      if (!p.modal) p.modal = { badge: "", lead: "", sections: [] };
      if (!Array.isArray(p.modal.sections)) p.modal.sections = [];
      if (!Array.isArray(p.tags)) p.tags = [];
      if (p.buttons?.secondary && !String(p.buttons.secondary.href || "").trim()) {
        delete p.buttons.secondary;
      }
    });

    return data;
  }

  function validateAboutClient(data) {
    const errors = [];
    if (!data?.profile?.name?.trim()) errors.push("Profil: Ad soyad zorunlu.");

    (data.education || []).forEach((edu, i) => {
      const hasAny =
        edu.school?.trim() || edu.period?.trim() || edu.location?.trim() || edu.department?.trim();
      if (!hasAny) {
        errors.push(`Eğitim ${i + 1}: Tamamen boş satır — doldurun veya silin.`);
      } else if (!edu.school?.trim()) {
        errors.push(`Eğitim ${i + 1}: Okul adı zorunlu.`);
      }
    });

    return errors;
  }

  async function saveTab(tab) {
    const secret = getSecret();
    if (!secret) throw new Error("Oturum kapalı. Tekrar giriş yapın.");

    const { api } = endpoints[tab];
    if (!state[tab]) throw new Error("Veri yüklenmedi.");

    let payload =
      tab === "projects"
        ? cleanProjectsPayload(state[tab])
        : tab === "about"
          ? normalizeAboutPayload(state[tab])
          : state[tab];

    if (tab === "about") {
      const clientErrors = validateAboutClient(payload);
      if (clientErrors.length) throw new Error(clientErrors.join(" "));
    }

    const res = await fetch(api, {
      method: "POST",
      headers: authHeaders(secret),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);

    state[tab] = payload;
    if (tab === "about") writeAboutBackup(payload);

    return { ...data, payload };
  }

  function slugify(text) {
    return String(text || "item")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || `item-${Date.now()}`;
  }

  function linesToArray(text) {
    return String(text || "")
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function arrayToLines(arr) {
    return (arr || []).join("\n");
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "className") node.className = v;
        else if (k === "htmlFor") node.htmlFor = v;
        else if (k.startsWith("data-")) node.setAttribute(k, v);
        else if (k === "text") node.textContent = v;
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function field(labelText, inputEl, hint) {
    const wrap = el("div", { className: "field" });
    wrap.appendChild(el("label", { text: labelText }));
    wrap.appendChild(inputEl);
    if (hint) wrap.appendChild(el("p", { className: "field-hint", text: hint }));
    return wrap;
  }

  function input(type, value, placeholder, dataset) {
    const i = document.createElement("input");
    i.type = type || "text";
    if (value != null) i.value = value;
    if (placeholder) i.placeholder = placeholder;
    if (dataset) Object.assign(i.dataset, dataset);
    return i;
  }

  function textarea(value, rows) {
    const t = document.createElement("textarea");
    if (value != null) t.value = value;
    if (rows) t.rows = rows;
    return t;
  }

  return {
    SESSION_KEY,
    endpoints,
    state,
    authHeaders,
    getSecret,
    setSecret,
    verifySecret,
    loadAll,
    saveTab,
    validateAboutClient,
    readAboutBackup,
    slugify,
    linesToArray,
    arrayToLines,
    el,
    field,
    input,
    textarea,
  };
})();
