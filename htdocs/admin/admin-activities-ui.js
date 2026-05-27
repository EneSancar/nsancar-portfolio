window.AdminActivitiesUI = (function () {
  const C = window.AdminCore;

  const SERIES_STATUSES = [
    { value: "watching", label: "İzliyorum" },
    { value: "finished", label: "Bitirdim" },
    { value: "wishlist", label: "Listemde" },
  ];

  const BOOK_STATUSES = [
    { value: "reading", label: "Okuyorum" },
    { value: "finished", label: "Okudum" },
    { value: "wishlist", label: "Listemde" },
  ];

  function statusSelect(statuses, current) {
    const sel = document.createElement("select");
    statuses.forEach(({ value, label }) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      if (value === current) opt.selected = true;
      sel.appendChild(opt);
    });
    return sel;
  }

  function ratingSelect(current) {
    const sel = document.createElement("select");
    for (let i = 0; i <= 5; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i === 0 ? "— Puan yok" : "★".repeat(i) + ` (${i}/5)`;
      if (Number(current) === i) opt.selected = true;
      sel.appendChild(opt);
    }
    return sel;
  }

  /* ──────────────────────── CHANNELS ──────────────────────── */
  function buildChannelsSection(data) {
    const wrap = C.el("div", { className: "activities-section" });
    wrap.appendChild(C.el("h3", { className: "activities-section-title", text: "Favori Kanallar" }));

    const list = C.el("div", { className: "activities-list", id: "channelsList" });
    wrap.appendChild(list);

    function rebuildList() {
      list.innerHTML = "";
      (data.channels || []).forEach((ch, idx) => {
        list.appendChild(buildChannelRow(ch, idx, data, rebuildList));
      });

      const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm" });
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Kanal ekle';
      addBtn.addEventListener("click", () => {
        if (!data.channels) data.channels = [];
        data.channels.push({
          id: `ch-${Date.now()}`,
          name: "",
          tag: "",
          description: "",
          url: "",
        });
        rebuildList();
      });
      list.appendChild(addBtn);
    }

    rebuildList();
    return wrap;
  }

  function buildChannelRow(ch, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: ch.name || `Kanal ${idx + 1}` });
    const delBtn = C.el("button", { type: "button", className: "btn-icon btn-icon--danger", title: "Sil" });
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener("click", () => {
      if (!confirm(`"${ch.name || "bu kanalı"}" silmek istiyor musunuz?`)) return;
      data.channels.splice(idx, 1);
      rebuild();
    });
    header.appendChild(title);
    header.appendChild(delBtn);
    row.appendChild(header);

    const body = C.el("div", { className: "activities-item-body" });

    const nameInp = C.input("text", ch.name, "Kanal adı");
    nameInp.addEventListener("input", () => {
      ch.name = nameInp.value;
      title.textContent = ch.name || `Kanal ${idx + 1}`;
    });
    body.appendChild(C.field("Kanal adı *", nameInp));

    const tagInp = C.input("text", ch.tag, "Tasarım, Teknoloji…");
    tagInp.addEventListener("input", () => { ch.tag = tagInp.value; });
    body.appendChild(C.field("Etiket", tagInp));

    const descTA = C.textarea(ch.description, 2);
    descTA.placeholder = "Kısa açıklama";
    descTA.addEventListener("input", () => { ch.description = descTA.value; });
    body.appendChild(C.field("Açıklama", descTA));

    // URL + avatar fetch satırı
    const urlRow = C.el("div", { className: "activities-url-row" });

    const urlInp = C.input("url", ch.url, "https://youtube.com/@...");
    urlInp.addEventListener("input", () => { ch.url = urlInp.value; });

    const fetchBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", title: "Profil fotoğrafını getir" });
    fetchBtn.innerHTML = '<i class="fa-solid fa-image"></i> Getir';

    const avatarStatus = C.el("span", { className: "avatar-fetch-status" });

    // Avatar önizleme
    const avatarPreview = C.el("div", { className: "channel-avatar-preview" });
    if (ch.avatar) {
      const img = document.createElement("img");
      img.src = ch.avatar;
      img.alt = ch.name;
      avatarPreview.appendChild(img);
      avatarPreview.classList.add("has-avatar");
    } else {
      avatarPreview.innerHTML = '<i class="fa-brands fa-youtube"></i>';
    }

    fetchBtn.addEventListener("click", async () => {
      const url = urlInp.value.trim();
      if (!url) { avatarStatus.textContent = "Önce URL girin."; return; }

      fetchBtn.disabled = true;
      fetchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      avatarStatus.textContent = "Getiriliyor…";

      try {
        const res = await fetch(`/api/yt-avatar?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        if (!res.ok || !data.avatar) throw new Error(data.error || "Bulunamadı");

        ch.avatar = data.avatar;
        avatarPreview.innerHTML = "";
        const img = document.createElement("img");
        img.src = data.avatar;
        img.alt = ch.name;
        avatarPreview.appendChild(img);
        avatarPreview.classList.add("has-avatar");
        avatarStatus.textContent = "✓ Fotoğraf alındı";
        avatarStatus.className = "avatar-fetch-status ok";
      } catch (err) {
        avatarStatus.textContent = `Hata: ${err.message}`;
        avatarStatus.className = "avatar-fetch-status err";
      } finally {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = '<i class="fa-solid fa-image"></i> Getir';
      }
    });

    const urlFieldWrap = C.el("div", { className: "activities-url-field" });
    urlFieldWrap.appendChild(urlInp);

    const urlBtnWrap = C.el("div", { className: "activities-url-btn-wrap" });
    urlBtnWrap.appendChild(fetchBtn);
    urlBtnWrap.appendChild(avatarStatus);

    urlRow.appendChild(avatarPreview);
    urlRow.appendChild(urlFieldWrap);
    urlRow.appendChild(urlBtnWrap);

    const urlFieldContainer = C.el("div", { className: "field" });
    urlFieldContainer.appendChild(C.el("label", { text: "YouTube URL + Profil fotoğrafı" }));
    urlFieldContainer.appendChild(urlRow);
    body.appendChild(urlFieldContainer);

    row.appendChild(body);
    return row;
  }

  /* ──────────────────────── SERIES ────────────────────────── */
  function buildSeriesSection(data) {
    const wrap = C.el("div", { className: "activities-section" });
    wrap.appendChild(C.el("h3", { className: "activities-section-title", text: "Favori Diziler" }));

    const list = C.el("div", { className: "activities-list", id: "seriesList" });
    wrap.appendChild(list);

    function rebuildList() {
      list.innerHTML = "";
      (data.series || []).forEach((s, idx) => {
        list.appendChild(buildSeriesRow(s, idx, data, rebuildList));
      });

      const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm" });
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Dizi ekle';
      addBtn.addEventListener("click", () => {
        if (!data.series) data.series = [];
        data.series.push({
          id: `s-${Date.now()}`,
          title: "",
          status: "wishlist",
          meta: "",
          rating: 0,
          poster: "",
        });
        rebuildList();
      });
      list.appendChild(addBtn);
    }

    rebuildList();
    return wrap;
  }

  function buildSeriesRow(s, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: s.title || `Dizi ${idx + 1}` });
    const delBtn = C.el("button", { type: "button", className: "btn-icon btn-icon--danger", title: "Sil" });
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener("click", () => {
      if (!confirm(`"${s.title || "bu diziyi"}" silmek istiyor musunuz?`)) return;
      data.series.splice(idx, 1);
      rebuild();
    });
    header.appendChild(title);
    header.appendChild(delBtn);
    row.appendChild(header);

    const body = C.el("div", { className: "activities-item-body" });

    const titleInp = C.input("text", s.title, "Dizi adı");
    titleInp.addEventListener("input", () => {
      s.title = titleInp.value;
      title.textContent = s.title || `Dizi ${idx + 1}`;
    });
    body.appendChild(C.field("Dizi adı *", titleInp));

    const statusSel = statusSelect(SERIES_STATUSES, s.status);
    statusSel.addEventListener("change", () => { s.status = statusSel.value; });
    body.appendChild(C.field("Durum", statusSel));

    const metaInp = C.input("text", s.meta, "Sezon · Tür");
    metaInp.addEventListener("input", () => { s.meta = metaInp.value; });
    body.appendChild(C.field("Meta bilgi", metaInp, "Örn: 2 sezon · Bilim kurgu, gerilim"));

    const ratingSel = ratingSelect(s.rating);
    ratingSel.addEventListener("change", () => { s.rating = Number(ratingSel.value); });
    body.appendChild(C.field("Puan", ratingSel));

    const posterRow = C.el("div", { className: "activities-poster-row" });
    const posterInp = C.input("url", s.poster, "https://... veya /favimg/show/...");
    posterInp.addEventListener("input", () => { s.poster = posterInp.value; });
    posterRow.appendChild(C.field("Poster URL", posterInp, "Boş bırakılırsa ikon gösterilir."));

    const uploadWrap = C.el("div", { className: "activities-upload-wrap" });
    window.AdminUpload.attachImageField(uploadWrap, {
      label: "veya dosyadan yükle",
      folder: "favimg/show",
      onUploaded: (url) => {
        s.poster = url;
        posterInp.value = url;
      },
    });
    posterRow.appendChild(uploadWrap);
    body.appendChild(posterRow);

    row.appendChild(body);
    return row;
  }

  /* ──────────────────────── BOOKS ─────────────────────────── */
  function buildBooksSection(data) {
    const wrap = C.el("div", { className: "activities-section" });
    wrap.appendChild(C.el("h3", { className: "activities-section-title", text: "Kütüphanem" }));

    const list = C.el("div", { className: "activities-list", id: "booksList" });
    wrap.appendChild(list);

    function rebuildList() {
      list.innerHTML = "";
      (data.books || []).forEach((b, idx) => {
        list.appendChild(buildBookRow(b, idx, data, rebuildList));
      });

      const addBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm" });
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Kitap ekle';
      addBtn.addEventListener("click", () => {
        if (!data.books) data.books = [];
        data.books.push({
          id: `b-${Date.now()}`,
          title: "",
          author: "",
          status: "wishlist",
          rating: 0,
          note: "",
          cover: "",
        });
        rebuildList();
      });
      list.appendChild(addBtn);
    }

    rebuildList();
    return wrap;
  }

  function buildBookRow(b, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: b.title || `Kitap ${idx + 1}` });
    const delBtn = C.el("button", { type: "button", className: "btn-icon btn-icon--danger", title: "Sil" });
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener("click", () => {
      if (!confirm(`"${b.title || "bu kitabı"}" silmek istiyor musunuz?`)) return;
      data.books.splice(idx, 1);
      rebuild();
    });
    header.appendChild(title);
    header.appendChild(delBtn);
    row.appendChild(header);

    const body = C.el("div", { className: "activities-item-body" });

    const titleInp = C.input("text", b.title, "Kitap adı");
    titleInp.addEventListener("input", () => {
      b.title = titleInp.value;
      title.textContent = b.title || `Kitap ${idx + 1}`;
    });
    body.appendChild(C.field("Kitap adı *", titleInp));

    const authorInp = C.input("text", b.author, "Yazar adı");
    authorInp.addEventListener("input", () => { b.author = authorInp.value; });
    body.appendChild(C.field("Yazar", authorInp));

    const statusSel = statusSelect(BOOK_STATUSES, b.status);
    statusSel.addEventListener("change", () => { b.status = statusSel.value; });
    body.appendChild(C.field("Durum", statusSel));

    const ratingSel = ratingSelect(b.rating);
    ratingSel.addEventListener("change", () => { b.rating = Number(ratingSel.value); });
    body.appendChild(C.field("Puan", ratingSel));

    const noteTA = C.textarea(b.note, 2);
    noteTA.placeholder = "Kısa not (isteğe bağlı)";
    noteTA.addEventListener("input", () => { b.note = noteTA.value; });
    body.appendChild(C.field("Not", noteTA));

    const coverRow = C.el("div", { className: "activities-poster-row" });
    const coverInp = C.input("url", b.cover, "https://... veya /favimg/books/...");
    coverInp.addEventListener("input", () => { b.cover = coverInp.value; });
    coverRow.appendChild(C.field("Kapak URL", coverInp, "Boş bırakılırsa ikon gösterilir."));

    const uploadWrap = C.el("div", { className: "activities-upload-wrap" });
    window.AdminUpload.attachImageField(uploadWrap, {
      label: "veya dosyadan yükle",
      folder: "favimg/books",
      onUploaded: (url) => {
        b.cover = url;
        coverInp.value = url;
      },
    });
    coverRow.appendChild(uploadWrap);
    body.appendChild(coverRow);

    row.appendChild(body);
    return row;
  }

  /* ──────────────────────── RENDER ────────────────────────── */
  function render(container, data) {
    container.innerHTML = "";
    container.appendChild(buildChannelsSection(data));
    container.appendChild(buildSeriesSection(data));
    container.appendChild(buildBooksSection(data));
  }

  return { render };
})();
