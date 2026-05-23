window.AdminCore = (function () {
  const SESSION_KEY = "nsancar_admin_secret";
  const AUTH_CHECK = "/api/auth-check";

  const endpoints = {
    about: { file: "data/about.json", api: "/api/about", title: "Hakkımda" },
    projects: { file: "data/projects.json", api: "/api/projects", title: "Projeler" },
  };

  const state = {
    tab: "about",
    about: null,
    projects: null,
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

  async function loadAll() {
    const [about, projects] = await Promise.all([
      fetchJson(endpoints.about.file),
      fetchJson(endpoints.projects.file),
    ]);
    state.about = about;
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

    const res = await fetch(api, {
      method: "POST",
      headers: authHeaders(secret),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `HTTP ${res.status}`);
    return data;
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
    slugify,
    linesToArray,
    arrayToLines,
    el,
    field,
    input,
    textarea,
  };
})();
