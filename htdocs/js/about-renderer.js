(function () {
  const DATA_URL = "data/about.json";
  const SC = window.SiteContent;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function formatExperienceLine(item) {
    const location = item.location ? `, ${item.location}` : "";
    return `<span class="highlight">${escapeHtml(item.role)}</span> — ${escapeHtml(item.company)}${location} / ${escapeHtml(item.period)}`;
  }

  async function renderProfile(sidebar, profile) {
    if (!sidebar || !profile) return;

    const img = sidebar.querySelector(".profile-img");
    const nameEl = sidebar.querySelector(".profile-name");
    const titleEl = sidebar.querySelector(".profile-title");
    const socialWrap = sidebar.querySelector(".profile-social");

    if (nameEl) nameEl.textContent = profile.name || "";
    if (titleEl) titleEl.textContent = profile.title || "";

    if (socialWrap) {
      const social = SC.asArray(profile.social);
      socialWrap.innerHTML = social.length
        ? social
            .filter((link) => link && link.href)
            .map(
              (link) =>
                `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener" aria-label="${escapeHtml(link.label || "")}"><i class="${escapeHtml(link.icon || "fa-solid fa-link")}"></i></a>`
            )
            .join("")
        : "";
    }

    if (img && profile.photo) {
      const bust = profile.photo.includes("?") ? "&" : "?";
      try {
        await SC.preloadImage(`${profile.photo}${bust}v=${Date.now()}`);
      } catch {
        /* yine de göster */
      }
      img.src = profile.photo;
      img.alt = profile.photoAlt || profile.name || "";
    }
  }

  function clearEntries(block, selector) {
    block?.querySelectorAll(selector).forEach((el) => el.remove());
    block?.querySelectorAll(".content-empty").forEach((el) => el.remove());
  }

  function renderAboutContent(container, data) {
    const profile = data.profile || {};

    const bioBlock = container.querySelector("[data-about-bio]");
    if (bioBlock) {
      const p = bioBlock.querySelector("p");
      if (p) p.textContent = profile.bio || "";
    }

    const educationBlock = container.querySelector("[data-about-education]");
    if (educationBlock) {
      clearEntries(educationBlock, ".education-entry");
      const education = SC.asArray(data.education);
      if (!education.length) {
        SC.appendEmptyNotice(educationBlock, "Henüz eğitim bilgisi eklenmedi.");
      } else {
        education.forEach((edu) => {
          const entry = document.createElement("div");
          entry.className = "education-entry";
          const h3 = document.createElement("h3");
          h3.textContent = `${edu.school || "—"} / ${edu.period || "—"}`;
          const p = document.createElement("p");
          const dept = edu.department ? ` — Bölüm: ${edu.department}` : "";
          p.textContent = `${edu.location || ""}${dept}`.trim() || "—";
          entry.append(h3, p);
          educationBlock.appendChild(entry);
        });
      }
    }

    const experienceBlock = container.querySelector("[data-about-experience]");
    if (experienceBlock) {
      clearEntries(experienceBlock, ".experience-entry");
      const experience = SC.asArray(data.experience);
      if (!experience.length) {
        SC.appendEmptyNotice(experienceBlock, "Henüz deneyim bilgisi eklenmedi.");
      } else {
        experience.forEach((item) => {
          const p = document.createElement("p");
          p.className = "experience-entry";
          p.innerHTML = formatExperienceLine(item);
          experienceBlock.appendChild(p);
        });
      }
    }

    const skillsList = container.querySelector("[data-about-skills] ul");
    if (skillsList) {
      const skills = SC.asArray(data.skills);
      skillsList.innerHTML = skills.length
        ? skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("")
        : "<li class=\"content-empty-li\">—</li>";
    }

    const interestsList = container.querySelector("[data-about-interests] ul");
    if (interestsList) {
      const interests = SC.asArray(data.interests);
      interestsList.innerHTML = interests.length
        ? interests.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
        : "<li class=\"content-empty-li\">—</li>";
    }
  }

  async function loadAbout() {
    const root = document.getElementById("aboutRoot");
    if (!root) return;

    try {
      const data = await SC.fetchJson(DATA_URL);

      await renderProfile(root.querySelector(".profile-sidebar"), data.profile);
      renderAboutContent(root.querySelector(".about-content-col"), data);

      root.classList.remove("about-layout--loading");
      root.classList.add("is-ready");
      root.querySelector(".about-content-col")?.classList.remove("about-content-col--loading");

      if (typeof window.nsancarInitReveal === "function") {
        window.nsancarInitReveal();
      }
    } catch (err) {
      root.classList.remove("about-layout--loading");
      root.classList.add("is-error");
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
