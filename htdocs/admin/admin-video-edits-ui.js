window.AdminVideoEditsUI = (function () {
  const C = window.AdminCore;

  function parseYoutubeId(url) {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const m = String(url).match(re);
      if (m) return m[1];
    }
    return null;
  }

  function deleteButton(title, onDelete) {
    const btn = C.el("button", { type: "button", className: "btn-icon btn-icon--danger", title: "Sil" });
    btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    btn.addEventListener("click", () => {
      if (confirm(`"${title}" silmek istiyor musunuz?`)) onDelete();
    });
    return btn;
  }

  function addButton(label, onAdd) {
    const btn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm activities-add-btn" });
    btn.innerHTML = `<i class="fa-solid fa-plus"></i> ${label}`;
    btn.addEventListener("click", onAdd);
    return btn;
  }

  function buildEditRow(edit, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: edit.title || `Edit ${idx + 1}` });
    header.appendChild(title);
    header.appendChild(deleteButton(edit.title || "bu editi", () => {
      data.edits.splice(idx, 1);
      rebuild();
    }));
    row.appendChild(header);

    const body = C.el("div", { className: "activities-item-body" });

    const titleInp = C.input("text", edit.title, "Örn: Breaking Bad — Sinematik Edit");
    titleInp.addEventListener("input", () => {
      edit.title = titleInp.value;
      title.textContent = edit.title || `Edit ${idx + 1}`;
    });
    body.appendChild(C.field("Başlık *", titleInp));

    const urlInp = C.input("url", edit.youtubeUrl, "https://youtube.com/watch?v=...");
    urlInp.addEventListener("input", () => { edit.youtubeUrl = urlInp.value.trim(); });
    body.appendChild(C.field("YouTube URL *", urlInp, "watch, youtu.be veya shorts bağlantısı"));

    row.appendChild(body);
    return row;
  }

  function buildEditsList(data) {
    const wrap = C.el("div", { className: "video-edits-admin-list" });
    if (!Array.isArray(data.edits)) data.edits = [];

    const list = C.el("div", { className: "activities-list" });
    wrap.appendChild(list);

    function rebuild() {
      list.innerHTML = "";
      data.edits.forEach((edit, idx) => list.appendChild(buildEditRow(edit, idx, data, rebuild)));
      list.appendChild(addButton("Edit ekle", () => {
        data.edits.push({
          id: `ve-${Date.now()}`,
          title: "",
          youtubeUrl: "",
        });
        rebuild();
      }));
    }

    rebuild();
    return wrap;
  }

  function render(container, data) {
    container.innerHTML = "";

    const lead = C.el("p", {
      className: "field-hint video-edits-admin-lead",
      text: "Projeler sayfasındaki Video Edit / After Effects slaytını buradan yönetirsin. Arka plan sabittir (image/video-edits-bg.gif); video eklerken kaybolmaz.",
    });
    container.appendChild(lead);

    const introTA = C.textarea(data.intro || "", 5);
    introTA.placeholder = "Bölüm açıklaması";
    introTA.addEventListener("input", () => { data.intro = introTA.value; });
    container.appendChild(C.field("Bölüm açıklaması", introTA));

    if (!String(data.backgroundImage || "").trim()) {
      data.backgroundImage = "image/video-edits-bg.gif";
    }

    const autoplayInp = C.input("number", data.autoplayMs ?? 7500, "7500");
    autoplayInp.min = "3000";
    autoplayInp.step = "500";
    autoplayInp.addEventListener("input", () => {
      const n = Number(autoplayInp.value);
      data.autoplayMs = Number.isFinite(n) && n >= 3000 ? n : 7500;
    });
    container.appendChild(C.field("Slayt geçiş süresi (ms)", autoplayInp, "En az 3000. Önerilen: 7000–8000"));

    const headingRow = C.el("div", { className: "video-edits-admin-heading" });
    headingRow.appendChild(C.el("h3", { className: "admin-section-heading", text: "Video editler" }));

    const quickAdd = C.el("button", { type: "button", className: "btn btn-primary btn-sm" });
    quickAdd.innerHTML = '<i class="fa-solid fa-plus"></i> Yeni edit ekle';
    quickAdd.addEventListener("click", () => {
      if (!Array.isArray(data.edits)) data.edits = [];
      data.edits.unshift({
        id: `ve-${Date.now()}`,
        title: "",
        youtubeUrl: "",
      });
      render(container, data);
    });
    headingRow.appendChild(quickAdd);
    container.appendChild(headingRow);

    container.appendChild(buildEditsList(data));
  }

  return { render, parseYoutubeId };
})();
