(function () {
  const C = window.AdminCore;

  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const saveBtn = document.getElementById("saveBtn");
  const reloadBtn = document.getElementById("reloadBtn");
  const statusEl = document.getElementById("adminStatus");
  const loginStatusEl = document.getElementById("loginStatus");
  const panelTitle = document.getElementById("panelTitle");
  const panelAbout = document.getElementById("panelAbout");
  const panelProjects = document.getElementById("panelProjects");
  const navItems = document.querySelectorAll(".admin-nav-item[data-tab]");

  function showStatus(message, ok, target) {
    const el = target || statusEl;
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
    el.className = `admin-toast ${ok ? "admin-toast--ok" : "admin-toast--err"}`;
  }

  function clearStatus() {
    [statusEl, loginStatusEl].forEach((el) => {
      if (!el) return;
      el.hidden = true;
      el.textContent = "";
    });
  }

  function renderActivePanel() {
    const tab = C.state.tab;
    panelTitle.textContent = C.endpoints[tab].title;
    panelAbout.hidden = tab !== "about";
    panelProjects.hidden = tab !== "projects";

    if (tab === "about" && C.state.about) {
      window.AdminAboutUI.render(panelAbout, C.state.about);
    }
    if (tab === "projects" && C.state.projects) {
      window.AdminProjectsUI.render(panelProjects, C.state.projects);
    }
  }

  async function loadDashboard() {
    clearStatus();
    saveBtn.disabled = true;
    reloadBtn.disabled = true;
    try {
      await C.loadAll();
      renderActivePanel();
      if (C.state.lastLoadUsedBackup) {
        showStatus(
          "Site henüz yeni deploy olmadığı için kayıtlı son sürümünüz gösteriliyor. 30-60 sn sonra Yenile yapabilirsiniz.",
          true
        );
      }
    } catch (err) {
      showStatus(`Veri yüklenemedi: ${err.message}`, false);
    } finally {
      saveBtn.disabled = false;
      reloadBtn.disabled = false;
    }
  }

  function showDashboard() {
    loginView.hidden = true;
    dashboardView.hidden = false;
    loadDashboard();
  }

  function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
    clearStatus();
  }

  async function saveCurrent() {
    const secret = C.getSecret();
    if (!secret) {
      showStatus("Oturum kapalı. Tekrar giriş yapın.", false);
      showLogin();
      return;
    }

    saveBtn.disabled = true;
    clearStatus();

    try {
      const data = await C.saveTab(C.state.tab);
      renderActivePanel();
      showStatus(
        `Kaydedildi. Site ~30-60 sn içinde güncellenir.` +
          (data.commit ? ` (commit: ${data.commit.slice(0, 7)})` : "") +
          " Yenile'ye hemen basmayın; deploy bitene kadar eski veri gelebilir.",
        true
      );
    } catch (err) {
      showStatus(`Kayıt başarısız: ${err.message}`, false);
    } finally {
      saveBtn.disabled = false;
    }
  }

  function switchTab(tab) {
    C.state.tab = tab;
    navItems.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.tab === tab);
    });
    renderActivePanel();
  }

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const secret = document.getElementById("adminSecret").value.trim();
    if (!secret) return;

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    showStatus("Anahtar doğrulanıyor…", true, loginStatusEl);

    const check = await C.verifySecret(secret);
    if (submitBtn) submitBtn.disabled = false;

    if (!check.ok) {
      showStatus(check.message, false, loginStatusEl);
      return;
    }

    C.setSecret(secret);
    clearStatus();
    showDashboard();
  });

  logoutBtn?.addEventListener("click", () => {
    C.setSecret(null);
    showLogin();
  });

  saveBtn?.addEventListener("click", saveCurrent);
  reloadBtn?.addEventListener("click", () => {
    const ok = confirm(
      "Veriler siteden yeniden yüklenecek.\n\nDeploy henüz bitmediyse yeni eklediğiniz kayıtlar kaybolmuş gibi görünebilir.\n\nDevam etmek istiyor musunuz?"
    );
    if (ok) loadDashboard();
  });

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.dataset.tab) return;
      switchTab(btn.dataset.tab);
    });
  });

  if (C.getSecret()) showDashboard();
  else showLogin();
})();
