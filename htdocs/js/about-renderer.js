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

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) {
        resolve();
        return;
      }
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Görsel yüklenemedi"));
      img.src = src;
    });
  }

  async function renderProfile(sidebar, profile) {
    const img = sidebar.querySelector(".profile-img");
    const nameEl = sidebar.querySelector(".profile-name");
    const titleEl = sidebar.querySelector(".profile-title");
    const socialWrap = sidebar.querySelector(".profile-social");

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

    if (img && profile.photo) {
      const photoUrl = profile.photo + (profile.photo.includes("?") ? "&" : "?") + "v=" + Date.now();
      try {
        await loadImage(photoUrl);
        img.src = profile.photo;
      } catch {
        img.src = profile.photo;
      }
      img.alt = profile.photoAlt || profile.name || "";
    }
  }

  function renderAboutContent(container, data) {
    const bioBlock = container.querySelector("[data-about-bio]");
    if (bioBlock) {
      const p = bioBlock.querySelector("p");
      if (p) p.textContent = data.profile.bio || "";
    }

    const educationBlock = container.querySelector("[data-about-education]");
    if (educationBlock) {
      educationBlock.querySelectorAll(".education-entry").forEach((el) => el.remove());
      data.education.forEach((edu) => {
        const entry = document.createElement("div");
        entry.className = "education-entry";
        const h3 = document.createElement("h3");
        h3.textContent = `${edu.school} / ${edu.period}`;
        const p = document.createElement("p");
        const dept = edu.department ? ` — Bölüm: ${edu.department}` : "";
        p.textContent = `${edu.location || ""}${dept}`.trim() || "—";
        entry.append(h3, p);
        educationBlock.appendChild(entry);
      });
    }

    const experienceBlock = container.querySelector("[data-about-experience]");
    if (experienceBlock) {
      experienceBlock.querySelectorAll(".experience-entry").forEach((el) => el.remove());
      data.experience.forEach((item) => {
        const p = document.createElement("p");
        p.className = "experience-entry";
        p.innerHTML = formatExperienceLine(item);
        experienceBlock.appendChild(p);
      });
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
      const res = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      await renderProfile(root.querySelector(".profile-sidebar"), data.profile);
      renderAboutContent(root.querySelector(".about-content-col"), data);

      root.classList.remove("about-layout--loading");
      root.classList.add("is-ready");

      if (typeof window.nsancarInitReveal === "function") {
        window.nsancarInitReveal();
      }
    } catch (err) {
      root.classList.remove("about-layout--loading");
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
