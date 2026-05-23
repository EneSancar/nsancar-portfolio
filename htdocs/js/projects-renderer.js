(function () {
  const DATA_URL = "data/projects.json";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function buildThumb(thumbnail) {
    const thumb = document.createElement("div");
    thumb.className = "project-card-thumb";

    if (thumbnail.type === "background") {
      thumb.style.backgroundImage = `url('${thumbnail.src}')`;
      return thumb;
    }

    thumb.classList.add("project-card-thumb--img");
    if (thumbnail.fit === "cover-top") {
      thumb.classList.add("project-card-thumb--cover-top");
    }

    const img = document.createElement("img");
    img.src = thumbnail.src;
    img.alt = thumbnail.alt || "";
    img.loading = "lazy";
    if (thumbnail.width) img.width = thumbnail.width;
    if (thumbnail.height) img.height = thumbnail.height;
    if (thumbnail.width || thumbnail.height) img.decoding = "async";
    thumb.appendChild(img);
    return thumb;
  }

  function buildCardActions(project) {
    const actions = document.createElement("div");
    actions.className = "project-card-actions";
    let hasActions = false;

    if (project.buttons?.detail !== false) {
      const detailBtn = document.createElement("button");
      detailBtn.type = "button";
      detailBtn.className = "project-card-link project-detail-btn";
      detailBtn.dataset.project = project.id;
      detailBtn.innerHTML = 'Detayları gör <i class="fa-solid fa-circle-info"></i>';
      actions.appendChild(detailBtn);
      hasActions = true;
    }

    const secondary = project.buttons?.secondary;
    if (secondary?.href) {
      const link = document.createElement("a");
      link.href = secondary.href;
      link.className = "project-card-link project-card-link--secondary";
      if (secondary.external !== false && /^https?:\/\//i.test(secondary.href)) {
        link.target = "_blank";
        link.rel = "noopener";
      }
      link.innerHTML = `${escapeHtml(secondary.label)} <i class="${escapeHtml(secondary.icon || "")}"></i>`;
      actions.appendChild(link);
      hasActions = true;
    }

    if (!hasActions && project.buttons?.detail !== false) {
      const detailBtn = document.createElement("button");
      detailBtn.type = "button";
      detailBtn.className = "project-card-link project-detail-btn";
      detailBtn.dataset.project = project.id;
      detailBtn.innerHTML = 'Detayları gör <i class="fa-solid fa-circle-info"></i>';
      return detailBtn;
    }

    return hasActions ? actions : null;
  }

  function buildCard(project, section) {
    const article = document.createElement("article");
    article.className = `project-card ${section.cardClass} reveal`;

    article.appendChild(buildThumb(project.thumbnail));

    const body = document.createElement("div");
    body.className = "project-card-body";

    const tags = document.createElement("div");
    tags.className = "project-card-tags";
    tags.innerHTML = (project.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    body.appendChild(tags);

    const title = document.createElement("h3");
    title.textContent = project.title;
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = project.description || "";
    body.appendChild(desc);

    const actions = buildCardActions(project);
    if (actions) {
      if (actions.classList?.contains("project-card-actions")) {
        body.appendChild(actions);
      } else {
        body.appendChild(actions);
      }
    }

    article.appendChild(body);
    return article;
  }

  function buildModalPreview(preview) {
    if (preview.type === "gallery" && Array.isArray(preview.images)) {
      const gallery = document.createElement("div");
      gallery.className = "project-modal-gallery";
      preview.images.forEach((image) => {
        const figure = document.createElement("figure");
        figure.className = "project-modal-figure";
        figure.innerHTML = `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || "")}" loading="lazy"><figcaption>${escapeHtml(image.caption || "")}</figcaption>`;
        gallery.appendChild(figure);
      });
      return gallery;
    }

    const wrap = document.createElement("div");
    wrap.className = "project-modal-preview";
    if (preview.type === "sharp") wrap.classList.add("project-modal-preview--sharp");

    const img = document.createElement("img");
    img.src = preview.src;
    img.alt = preview.alt || "";
    img.loading = "lazy";
    if (preview.width) img.width = preview.width;
    if (preview.height) img.height = preview.height;
    if (preview.width || preview.height) img.decoding = "async";
    wrap.appendChild(img);
    return wrap;
  }

  function buildModalTemplate(project) {
    const tpl = document.createElement("template");
    tpl.id = `project-detail-${project.id}`;
    const modal = project.modal;

    const header = document.createElement("div");
    header.className = "project-modal-header";
    header.innerHTML = `
      <span class="project-modal-badge">${modal.badge || ""}</span>
      <h2 id="projectModalTitle">${escapeHtml(project.title)}</h2>
      <p class="project-modal-lead">${modal.lead || ""}</p>
    `;

    const body = document.createElement("div");
    body.className = "project-modal-body";

    (modal.sections || []).forEach((section) => {
      if (section.heading) {
        const h3 = document.createElement("h3");
        h3.textContent = section.heading;
        body.appendChild(h3);
      }
      if (section.type === "list" && Array.isArray(section.items)) {
        const ul = document.createElement("ul");
        ul.innerHTML = section.items.map((item) => `<li>${item}</li>`).join("");
        body.appendChild(ul);
      } else if (section.content) {
        const p = document.createElement("p");
        p.innerHTML = section.content;
        body.appendChild(p);
      }
    });

    if (modal.note?.text) {
      const note = document.createElement("p");
      note.className = "project-modal-note";
      const icon = modal.note.icon ? `<i class="${escapeHtml(modal.note.icon)}"></i> ` : "";
      note.innerHTML = `${icon}${modal.note.text}`;
      body.appendChild(note);
    }

    if (modal.cta?.href) {
      const cta = document.createElement("a");
      cta.href = modal.cta.href;
      cta.className = "btn btn-primary project-modal-cta";
      if (modal.cta.external !== false && /^https?:\/\//i.test(modal.cta.href)) {
        cta.target = "_blank";
        cta.rel = "noopener";
      }
      cta.innerHTML = `<i class="${escapeHtml(modal.cta.icon || "")}"></i> ${escapeHtml(modal.cta.label || "Devam")}`;
      body.appendChild(cta);
    }

    const fragment = document.createDocumentFragment();
    fragment.appendChild(header);
    if (modal.preview) fragment.appendChild(buildModalPreview(modal.preview));
    fragment.appendChild(body);
    tpl.content.appendChild(fragment);
    return tpl;
  }

  function renderProjects(data) {
    const container = document.getElementById("projectsContainer");
    const templatesHost = document.getElementById("projectTemplates");
    if (!container || !templatesHost) return;

    if (data.hero) {
      const heroTitle = document.querySelector(".projects-hero h1");
      const heroLabel = document.querySelector(".projects-hero .section-label");
      const heroSubtitle = document.querySelector(".projects-hero p");
      if (heroLabel && data.hero.label) heroLabel.textContent = data.hero.label;
      if (heroTitle && data.hero.title) heroTitle.textContent = data.hero.title;
      if (heroSubtitle && data.hero.subtitle) heroSubtitle.textContent = data.hero.subtitle;
    }

    container.innerHTML = "";
    templatesHost.innerHTML = "";

    const projectsBySection = {};
    data.projects.forEach((project) => {
      if (!projectsBySection[project.sectionId]) projectsBySection[project.sectionId] = [];
      projectsBySection[project.sectionId].push(project);
    });

    data.sections.forEach((section) => {
      const sectionProjects = projectsBySection[section.id] || [];
      if (!sectionProjects.length) return;

      const sectionEl = document.createElement("section");
      sectionEl.className = "projects-section reveal";
      sectionEl.innerHTML = `<h2 class="projects-section-title"><i class="${escapeHtml(section.icon)}"></i> ${escapeHtml(section.title)}</h2>`;

      const grid = document.createElement("div");
      grid.className = "project-grid";
      sectionProjects.forEach((project) => {
        grid.appendChild(buildCard(project, section));
        templatesHost.appendChild(buildModalTemplate(project));
      });

      sectionEl.appendChild(grid);
      container.appendChild(sectionEl);
    });

    if (typeof window.nsancarInitProjectModal === "function") {
      window.nsancarInitProjectModal();
    }
    if (typeof window.nsancarInitReveal === "function") {
      window.nsancarInitReveal();
    }
  }

  async function loadProjects() {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderProjects(data);
    } catch (err) {
      const fallback = document.getElementById("projectsFallback");
      if (fallback) fallback.hidden = false;
      console.error("projects.json yüklenemedi:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadProjects);
  } else {
    loadProjects();
  }
})();
