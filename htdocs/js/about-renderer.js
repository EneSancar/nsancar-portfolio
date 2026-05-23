(function () {
  const DATA_URL = "data/about.json";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatExperienceLine(item) {
    const location = item.location ? `, ${item.location}` : "";
    return `<span class="highlight">${escapeHtml(item.role)}</span> — ${escapeHtml(item.company)}${location} / ${escapeHtml(item.period)}`;
  }

  function renderProfile(sidebar, profile) {
    const img = sidebar.querySelector(".profile-img");
    const nameEl = sidebar.querySelector(".profile-info h1");
    const titleEl = sidebar.querySelector(".profile-info > p");
    const socialWrap = sidebar.querySelector(".profile-social");

    if (img) {
      img.src = profile.photo || img.src;
      img.alt = profile.photoAlt || profile.name || "";
    }
    if (nameEl) nameEl.textContent = profile.name || "";
    if (titleEl) titleEl.textContent = profile.title || "";

    if (socialWrap && Array.isArray(profile.social)) {
      socialWrap.innerHTML = profile.social
        .map(
          (link) =>
            `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener" aria-label="${escapeHtml(link.label)}"><i class="${escapeHtml(link.icon)}"></i></a>`
        )
        .join("");
    }
  }

  function renderAboutContent(container, data) {
    const bioBlock = container.querySelector("[data-about-bio]");
    if (bioBlock) {
      const p = bioBlock.querySelector("p");
      if (p) p.textContent = data.profile.bio || "";
    }

    const educationBlock = container.querySelector("[data-about-education]");
    if (educationBlock && data.education.length) {
      const edu = data.education[0];
      const h3 = educationBlock.querySelector("h3");
      const p = educationBlock.querySelector("p");
      if (h3) h3.textContent = `${edu.school} / ${edu.period}`;
      if (p) {
        p.textContent = `${edu.location}${edu.department ? ` — Bölüm: ${edu.department}` : ""}`;
      }
    }

    const experienceBlock = container.querySelector("[data-about-experience]");
    if (experienceBlock) {
      experienceBlock.innerHTML = data.experience.map((item) => `<p>${formatExperienceLine(item)}</p>`).join("");
    }

    const skillsList = container.querySelector("[data-about-skills] ul");
    if (skillsList) {
      skillsList.innerHTML = data.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
    }

    const interestsList = container.querySelector("[data-about-interests] ul");
    if (interestsList) {
      interestsList.innerHTML = data.interests.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }
  }

  async function loadAbout() {
    const root = document.getElementById("aboutRoot");
    if (!root) return;

    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      renderProfile(root.querySelector(".profile-sidebar"), data.profile);
      renderAboutContent(root.querySelector(".about-content-col"), data);

      if (typeof window.nsancarInitReveal === "function") {
        window.nsancarInitReveal();
      }
    } catch (err) {
      const fallback = document.getElementById("aboutFallback");
      if (fallback) fallback.hidden = false;
      console.error("about.json yüklenemedi:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAbout);
  } else {
    loadAbout();
  }
})();
