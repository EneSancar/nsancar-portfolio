window.AdminProjectsUI = (function () {
  const C = window.AdminCore;
  let selectedIndex = 0;

  function bindInput(input, setter) {
    input.addEventListener("input", () => setter(input.value));
  }

  function bindCheck(input, setter) {
    input.addEventListener("change", () => setter(input.checked));
  }

  function newProjectTemplate(data) {
    const id = `proje-${Date.now()}`;
    return {
      id,
      sectionId: data.sections[0]?.id || "web",
      title: "Yeni Proje",
      description: "",
      tags: [],
      thumbnail: { type: "img", src: "", alt: "" },
      buttons: { detail: true },
      modal: {
        badge: "",
        lead: "",
        preview: { type: "single", src: "", alt: "" },
        sections: [{ heading: "Proje tanımı", type: "paragraph", content: "" }],
        cta: { label: "Bağlantı", icon: "fa-solid fa-link", href: "", external: true },
      },
    };
  }

  function render(container, data) {
    container.innerHTML = "";
    selectedIndex = 0;

    container.appendChild(renderHero(data));

    const layout = C.el("div", { className: "projects-layout" });
    const listCol = C.el("div", { className: "admin-card-block" });
    listCol.appendChild(C.el("div", { className: "admin-block-header" }, [
      C.el("h3", { text: "Proje listesi" }),
      C.el("button", { type: "button", className: "btn btn-ghost btn-sm", id: "addProjectBtn", text: "+ Yeni" }),
    ]));

    const listEl = C.el("div", { className: "project-list", id: "projectList" });
    listCol.appendChild(listEl);

    const editorCol = C.el("div", { className: "project-editor", id: "projectEditor" });
    layout.appendChild(listCol);
    layout.appendChild(editorCol);
    container.appendChild(layout);

    function drawList() {
      listEl.innerHTML = "";
      data.projects.forEach((project, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `project-list-item${index === selectedIndex ? " is-active" : ""}`;

        const thumb = project.thumbnail?.src
          ? C.el("img", { src: `../${project.thumbnail.src}`, alt: "" })
          : C.el("span", { className: "admin-login-logo", text: "?" });

        const meta = C.el("div", { className: "project-list-item__meta" }, [
          C.el("strong", { text: project.title }),
          C.el("span", { text: data.sections.find((s) => s.id === project.sectionId)?.title || project.sectionId }),
        ]);

        btn.append(thumb, meta);
        btn.addEventListener("click", () => {
          selectedIndex = index;
          drawList();
          drawEditor();
        });
        listEl.appendChild(btn);
      });
    }

    function drawEditor() {
      editorCol.innerHTML = "";
      const project = data.projects[selectedIndex] || null;
      if (!project) {
        editorCol.appendChild(C.el("div", { className: "project-editor-empty", text: "Soldan bir proje seçin veya yeni ekleyin." }));
        return;
      }

      const delTop = C.el("button", {
        type: "button",
        className: "btn btn-danger btn-sm",
        text: "Projeyi sil",
      });
      delTop.addEventListener("click", () => {
        if (!confirm(`"${project.title}" silinsin mi?`)) return;
        data.projects = data.projects.filter((_, i) => i !== selectedIndex);
        selectedIndex = Math.min(selectedIndex, data.projects.length - 1);
        if (selectedIndex < 0) selectedIndex = 0;
        drawList();
        drawEditor();
      });

      const head = C.el("div", { className: "admin-block-header" }, [
        C.el("h3", { text: project.title }),
        delTop,
      ]);
      editorCol.appendChild(head);

      editorCol.appendChild(buildGeneralFields(project, data));
      editorCol.appendChild(buildThumbFields(project));
      editorCol.appendChild(buildButtonsFields(project));
      editorCol.appendChild(buildModalFields(project));
      editorCol.appendChild(buildModalSections(project));
    }

    container.querySelector("#addProjectBtn").addEventListener("click", () => {
      const p = newProjectTemplate(data);
      data.projects.push(p);
      selectedIndex = data.projects.length - 1;
      drawList();
      drawEditor();
    });

    drawList();
    drawEditor();
  }

  function renderHero(data) {
    const block = C.el("section", { className: "admin-card-block" });
    block.appendChild(C.el("h3", {}, [icon("fa-solid fa-heading"), document.createTextNode(" Sayfa başlığı")]));
    const h = data.hero;

    const row = C.el("div", { className: "field-row" });
    const labelIn = C.input("text", h.label);
    bindInput(labelIn, (v) => { h.label = v; });
    row.appendChild(C.field("Etiket", labelIn));

    const titleIn = C.input("text", h.title);
    bindInput(titleIn, (v) => { h.title = v; });
    row.appendChild(C.field("Başlık", titleIn));
    block.appendChild(row);

    const subTa = C.textarea(h.subtitle, 2);
    bindInput(subTa, (v) => { h.subtitle = v; });
    block.appendChild(C.field("Alt başlık", subTa));
    return block;
  }

  function buildGeneralFields(project, data) {
    const details = document.createElement("details");
    details.className = "admin-accordion";
    details.open = true;
    details.appendChild(C.el("summary", { text: "Genel bilgiler" }));
    const body = C.el("div", { className: "admin-accordion__body" });

    const idIn = C.input("text", project.id);
    idIn.addEventListener("change", () => {
      project.id = C.slugify(idIn.value) || project.id;
      idIn.value = project.id;
    });
    body.appendChild(C.field("Proje ID (değiştirince kaydet)", idIn));

    const sel = document.createElement("select");
    data.sections.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.title;
      if (s.id === project.sectionId) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", () => { project.sectionId = sel.value; });
    body.appendChild(C.field("Bölüm", sel));

    const titleIn = C.input("text", project.title);
    bindInput(titleIn, (v) => { project.title = v; });
    body.appendChild(C.field("Başlık", titleIn));

    const descTa = C.textarea(project.description, 3);
    bindInput(descTa, (v) => { project.description = v; });
    body.appendChild(C.field("Kısa açıklama (kart)", descTa));

    const tagsTa = C.textarea(C.arrayToLines(project.tags), 3);
    bindInput(tagsTa, (v) => { project.tags = C.linesToArray(v); });
    body.appendChild(C.field("Etiketler", tagsTa, "Her satıra bir etiket"));

    details.appendChild(body);
    return details;
  }

  function buildThumbFields(project) {
    const details = document.createElement("details");
    details.className = "admin-accordion";
    details.open = true;
    details.appendChild(C.el("summary", { text: "Kapak görseli" }));
    const body = C.el("div", { className: "admin-accordion__body" });
    const t = project.thumbnail || (project.thumbnail = { type: "img", src: "", alt: "" });
    t.type = "img";

    const srcIn = C.input("text", t.src, "image/projects/...");
    bindInput(srcIn, (v) => {
      t.src = v;
      if (project.modal?.preview) project.modal.preview.src = v;
    });
    body.appendChild(
      window.AdminUpload.attachImageField({
        label: "Kapak görseli",
        pathInput: srcIn,
        folder: "image/projects",
        onUploaded: (path) => {
          if (project.modal?.preview) project.modal.preview.src = path;
        },
      })
    );

    const altIn = C.input("text", t.alt);
    bindInput(altIn, (v) => { t.alt = v; });
    body.appendChild(C.field("Alt metin", altIn));

    details.appendChild(body);
    return details;
  }

  function buildButtonsFields(project) {
    const details = document.createElement("details");
    details.className = "admin-accordion";
    details.appendChild(C.el("summary", { text: "Kart butonları" }));
    const body = C.el("div", { className: "admin-accordion__body" });
    project.buttons = project.buttons || { detail: true };

    const detailWrap = C.el("div", { className: "checkbox-field" });
    const detailCb = document.createElement("input");
    detailCb.type = "checkbox";
    detailCb.checked = project.buttons.detail !== false;
    bindCheck(detailCb, (v) => { project.buttons.detail = v; });
    detailWrap.append(detailCb, C.el("label", { text: "“Detayları gör” butonu göster" }));
    body.appendChild(detailWrap);

    const sec = project.buttons.secondary || (project.buttons.secondary = { label: "", href: "", icon: "" });
    const labelIn = C.input("text", sec.label || "", "Figma'da aç");
    bindInput(labelIn, (v) => { sec.label = v; });
    body.appendChild(C.field("İkincil buton metni (boş = gizli)", labelIn));

    const hrefIn = C.input("url", sec.href || "", "https://");
    bindInput(hrefIn, (v) => { sec.href = v; });
    body.appendChild(C.field("İkincil buton linki", hrefIn));

    const iconIn = C.input("text", sec.icon || "", "fa-brands fa-figma");
    bindInput(iconIn, (v) => { sec.icon = v; });
    body.appendChild(C.field("İkincil buton ikonu", iconIn));

    details.appendChild(body);
    return details;
  }

  function buildModalFields(project) {
    const details = document.createElement("details");
    details.className = "admin-accordion";
    details.open = true;
    details.appendChild(C.el("summary", { text: "Detay penceresi (modal)" }));
    const body = C.el("div", { className: "admin-accordion__body" });
    const m = project.modal || (project.modal = {});

    const badgeIn = C.input("text", m.badge || "");
    bindInput(badgeIn, (v) => { m.badge = v; });
    body.appendChild(C.field("Rozet metni", badgeIn));

    const leadTa = C.textarea(m.lead || "", 3);
    bindInput(leadTa, (v) => { m.lead = v; });
    body.appendChild(C.field("Öne çıkan açıklama", leadTa));

    m.preview = m.preview || { type: "single", src: "", alt: "" };
    m.preview.type = "single";
    const prevSrc = C.input("text", m.preview.src || project.thumbnail?.src || "");
    bindInput(prevSrc, (v) => { m.preview.src = v; });
    body.appendChild(
      window.AdminUpload.attachImageField({
        label: "Modal görseli",
        pathInput: prevSrc,
        folder: "image/projects",
      })
    );

    const cta = m.cta || (m.cta = { label: "", href: "", icon: "fa-solid fa-link", external: true });
    const ctaLabel = C.input("text", cta.label || "");
    bindInput(ctaLabel, (v) => { cta.label = v; });
    body.appendChild(C.field("Alt CTA metni", ctaLabel));

    const ctaHref = C.input("url", cta.href || "");
    bindInput(ctaHref, (v) => { cta.href = v; });
    body.appendChild(C.field("Alt CTA linki", ctaHref));

    details.appendChild(body);
    return details;
  }

  function buildModalSections(project) {
    const block = C.el("section", { className: "admin-card-block" });
    const header = C.el("div", { className: "admin-block-header" });
    header.appendChild(C.el("h3", { text: "Modal içerik bölümleri" }));
    const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", text: "+ Bölüm ekle" });
    header.appendChild(addBtn);
    block.appendChild(header);

    const m = project.modal || (project.modal = {});
    m.sections = m.sections || [];
    const list = C.el("div");

    function draw() {
      list.innerHTML = "";
      m.sections.forEach((section, index) => {
        const card = C.el("div", { className: "admin-repeater-item" });
        card.appendChild(C.el("div", { className: "admin-repeater-item__title", text: `Bölüm ${index + 1}` }));

        const headIn = C.input("text", section.heading || "");
        bindInput(headIn, (v) => { section.heading = v; });
        card.appendChild(C.field("Başlık", headIn));

        const typeSel = document.createElement("select");
        [["paragraph", "Paragraf"], ["list", "Liste"]].forEach(([val, label]) => {
          const opt = document.createElement("option");
          opt.value = val;
          opt.textContent = label;
          if (section.type === val) opt.selected = true;
          typeSel.appendChild(opt);
        });
        typeSel.addEventListener("change", () => {
          section.type = typeSel.value;
          if (section.type === "list" && !section.items) section.items = [];
          if (section.type === "paragraph") delete section.items;
          draw();
        });
        card.appendChild(C.field("Tür", typeSel));

        if (section.type === "list") {
          section.items = section.items || [];
          const itemsTa = C.textarea(section.items.join("\n"), 5);
          bindInput(itemsTa, (v) => {
            section.items = v.split("\n").map((s) => s.trim()).filter(Boolean);
          });
          card.appendChild(C.field("Liste maddeleri (her satır bir madde, HTML kullanılabilir)", itemsTa));
        } else {
          section.type = "paragraph";
          const contentTa = C.textarea(section.content || "", 4);
          bindInput(contentTa, (v) => { section.content = v; });
          card.appendChild(C.field("Paragraf metni", contentTa));
        }

        const del = C.el("button", { type: "button", className: "btn btn-danger btn-sm", text: "Bölümü sil" });
        del.addEventListener("click", () => {
          m.sections.splice(index, 1);
          draw();
        });
        card.appendChild(C.el("div", { className: "admin-repeater-item__actions" }, [del]));
        list.appendChild(card);
      });
    }

    addBtn.addEventListener("click", () => {
      m.sections.push({ heading: "Yeni bölüm", type: "paragraph", content: "" });
      draw();
    });

    draw();
    block.appendChild(list);
    return block;
  }

  function icon(cls) {
    const i = document.createElement("i");
    i.className = cls;
    return i;
  }

  return { render };
})();
