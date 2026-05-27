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

  // Alt sekme durumu — render çağrıları arasında korunur
  let activeSubtab = "channels";

  /* ──────────────────────── Helpers ─────────────────────────── */
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

  /* ──────────────────────── CHANNELS ─────────────────────────── */
  function buildChannelsSection(data) {
    const wrap = C.el("div", { className: "activities-section", "data-subpanel": "channels" });
    if (!Array.isArray(data.channels)) data.channels = [];

    const list = C.el("div", { className: "activities-list" });
    wrap.appendChild(list);

    function rebuild() {
      list.innerHTML = "";
      data.channels.forEach((ch, idx) => list.appendChild(buildChannelRow(ch, idx, data, rebuild)));
      list.appendChild(addButton("Kanal ekle", () => {
        data.channels.push({
          id: `ch-${Date.now()}`,
          name: "", tag: "", description: "", url: "", avatar: "",
        });
        rebuild();
      }));
    }

    rebuild();
    return wrap;
  }

  function buildChannelRow(ch, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: ch.name || `Kanal ${idx + 1}` });
    header.appendChild(title);
    header.appendChild(deleteButton(ch.name || "bu kanalı", () => {
      data.channels.splice(idx, 1);
      rebuild();
    }));
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

    // URL + otomatik avatar getirme bloğu
    body.appendChild(buildChannelUrlBlock(ch, nameInp, title, idx));

    row.appendChild(body);
    return row;
  }

  function buildChannelUrlBlock(ch, nameInp, titleSpan, idx) {
    const container = C.el("div", { className: "field activities-channel-url-block" });
    container.appendChild(C.el("label", { text: "YouTube URL + Profil fotoğrafı" }));

    const urlRow = C.el("div", { className: "activities-url-row" });

    // Avatar önizleme
    const avatarPreview = C.el("div", { className: "channel-avatar-preview" });
    function renderAvatar() {
      avatarPreview.innerHTML = "";
      if (ch.avatar) {
        const img = document.createElement("img");
        img.src = ch.avatar;
        img.alt = ch.name || "";
        img.onerror = () => {
          avatarPreview.innerHTML = '<i class="fa-brands fa-youtube"></i>';
          avatarPreview.classList.remove("has-avatar");
        };
        avatarPreview.appendChild(img);
        avatarPreview.classList.add("has-avatar");
      } else {
        avatarPreview.innerHTML = '<i class="fa-brands fa-youtube"></i>';
        avatarPreview.classList.remove("has-avatar");
      }
    }
    renderAvatar();

    const urlInp = C.input("url", ch.url, "https://youtube.com/@...");
    urlInp.addEventListener("input", () => { ch.url = urlInp.value; });

    const fetchBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", title: "Profil fotoğrafını getir" });
    fetchBtn.innerHTML = '<i class="fa-solid fa-image"></i> Getir';

    const avatarStatus = C.el("span", { className: "avatar-fetch-status" });

    fetchBtn.addEventListener("click", async () => {
      const url = (urlInp.value || "").trim();
      if (!url) {
        avatarStatus.textContent = "Önce URL girin.";
        avatarStatus.className = "avatar-fetch-status err";
        return;
      }

      fetchBtn.disabled = true;
      fetchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      avatarStatus.textContent = "Getiriliyor…";
      avatarStatus.className = "avatar-fetch-status";

      try {
        const res = await fetch(`/api/yt-avatar?url=${encodeURIComponent(url)}`);
        const result = await res.json().catch(() => ({}));
        if (!res.ok || !result.avatar) throw new Error(result.error || "Bulunamadı");

        ch.avatar = result.avatar;
        renderAvatar();

        if (!ch.name && result.name) {
          ch.name = result.name;
          nameInp.value = result.name;
          titleSpan.textContent = result.name;
        }

        avatarStatus.textContent = "✓ Fotoğraf alındı";
        avatarStatus.className = "avatar-fetch-status ok";
      } catch (err) {
        avatarStatus.textContent = err.message || "Hata";
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

    container.appendChild(urlRow);

    // Manuel avatar URL
    const manualAvatarInp = C.input("url", ch.avatar || "", "https://yt3.googleusercontent.com/...");
    manualAvatarInp.addEventListener("input", () => {
      ch.avatar = (manualAvatarInp.value || "").trim();
      renderAvatar();
    });
    container.appendChild(C.field("Avatar URL (manuel)", manualAvatarInp, "Otomatik çekilemezse buraya yapıştırın."));

    return container;
  }

  /* ──────────────────────── SERIES ─────────────────────────── */
  function buildSeriesSection(data) {
    const wrap = C.el("div", { className: "activities-section", "data-subpanel": "series" });
    if (!Array.isArray(data.series)) data.series = [];

    const list = C.el("div", { className: "activities-list" });
    wrap.appendChild(list);

    function rebuild() {
      list.innerHTML = "";
      data.series.forEach((s, idx) => list.appendChild(buildSeriesRow(s, idx, data, rebuild)));
      list.appendChild(addButton("Dizi ekle", () => {
        data.series.push({
          id: `s-${Date.now()}`,
          title: "", status: "wishlist", meta: "", rating: 0, poster: "",
        });
        rebuild();
      }));
    }

    rebuild();
    return wrap;
  }

  function buildSeriesRow(s, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: s.title || `Dizi ${idx + 1}` });
    header.appendChild(title);
    header.appendChild(deleteButton(s.title || "bu diziyi", () => {
      data.series.splice(idx, 1);
      rebuild();
    }));
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

    // Poster — attachImageField doğru imzayla
    const posterInp = C.input("url", s.poster, "/favimg/show/... veya https://...");
    posterInp.addEventListener("input", () => { s.poster = posterInp.value.trim(); });
    body.appendChild(window.AdminUpload.attachImageField({
      label: "Poster",
      pathInput: posterInp,
      folder: "favimg/show",
      hint: "URL yapıştırın veya dosyadan yükleyin. Boş bırakılırsa ikon gösterilir.",
      onUploaded: (path) => { s.poster = path; },
    }));

    row.appendChild(body);
    return row;
  }

  /* ──────────────────────── BOOKS ─────────────────────────── */
  function buildBooksSection(data) {
    const wrap = C.el("div", { className: "activities-section", "data-subpanel": "books" });
    if (!Array.isArray(data.books)) data.books = [];

    const notice = C.el("p", { className: "activities-subnotice", text: "Bu bölüm sitede şu an gizli — yine de buradan düzenleyebilirsiniz." });
    wrap.appendChild(notice);

    const list = C.el("div", { className: "activities-list" });
    wrap.appendChild(list);

    function rebuild() {
      list.innerHTML = "";
      data.books.forEach((b, idx) => list.appendChild(buildBookRow(b, idx, data, rebuild)));
      list.appendChild(addButton("Kitap ekle", () => {
        data.books.push({
          id: `b-${Date.now()}`,
          title: "", author: "", status: "wishlist", rating: 0, note: "", cover: "",
        });
        rebuild();
      }));
    }

    rebuild();
    return wrap;
  }

  function buildBookRow(b, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const title = C.el("span", { className: "activities-item-label", text: b.title || `Kitap ${idx + 1}` });
    header.appendChild(title);
    header.appendChild(deleteButton(b.title || "bu kitabı", () => {
      data.books.splice(idx, 1);
      rebuild();
    }));
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

    // Kapak — attachImageField doğru imzayla
    const coverInp = C.input("url", b.cover, "/favimg/books/... veya https://...");
    coverInp.addEventListener("input", () => { b.cover = coverInp.value.trim(); });
    body.appendChild(window.AdminUpload.attachImageField({
      label: "Kapak",
      pathInput: coverInp,
      folder: "favimg/books",
      hint: "URL yapıştırın veya dosyadan yükleyin.",
      onUploaded: (path) => { b.cover = path; },
    }));

    row.appendChild(body);
    return row;
  }

  /* ──────────────────────── MUSIC ─────────────────────────── */
  function buildMusicSection(data) {
    const wrap = C.el("div", { className: "activities-section", "data-subpanel": "music" });
    if (!Array.isArray(data.music)) data.music = [];

    const list = C.el("div", { className: "activities-list" });
    wrap.appendChild(list);

    function rebuild() {
      list.innerHTML = "";
      data.music.forEach((m, idx) => list.appendChild(buildMusicRow(m, idx, data, rebuild)));
      list.appendChild(addButton("Müzik ekle", () => {
        data.music.push({
          id: `m-${Date.now()}`,
          artist: "", title: "", image: "", url: "",
        });
        rebuild();
      }));
    }

    rebuild();
    return wrap;
  }

  function buildMusicRow(m, idx, data, rebuild) {
    const row = C.el("div", { className: "activities-item-card" });

    const header = C.el("div", { className: "activities-item-header" });
    const headerTitle = m.artist || m.title
      ? `${m.artist || "—"} — ${m.title || "—"}`
      : `Müzik ${idx + 1}`;
    const title = C.el("span", { className: "activities-item-label", text: headerTitle });
    header.appendChild(title);
    header.appendChild(deleteButton(m.title || "bu şarkıyı", () => {
      data.music.splice(idx, 1);
      rebuild();
    }));
    row.appendChild(header);

    const body = C.el("div", { className: "activities-item-body" });

    // Spotify URL + Getir
    body.appendChild(buildMusicSpotifyBlock(m, title, row));

    // Sanatçı
    const artistInp = C.input("text", m.artist, "Sanatçı");
    artistInp.dataset.role = "music-artist";
    artistInp.addEventListener("input", () => {
      m.artist = artistInp.value;
      title.textContent = `${m.artist || "—"} — ${m.title || "—"}`;
    });
    body.appendChild(C.field("Sanatçı *", artistInp));

    // Şarkı adı
    const titleInp = C.input("text", m.title, "Şarkı adı");
    titleInp.dataset.role = "music-title";
    titleInp.addEventListener("input", () => {
      m.title = titleInp.value;
      title.textContent = `${m.artist || "—"} — ${m.title || "—"}`;
    });
    body.appendChild(C.field("Şarkı adı *", titleInp));

    // Görsel (URL + dosya yükleme tek widget)
    const imgInp = C.input("text", m.image, "image/music/... veya https://...");
    imgInp.dataset.role = "music-image";
    imgInp.addEventListener("input", () => { m.image = imgInp.value.trim(); });
    body.appendChild(window.AdminUpload.attachImageField({
      label: "Görsel (sanatçı/albüm)",
      pathInput: imgInp,
      folder: "image/music",
      hint: "Spotify'dan otomatik gelir; istersen dosyadan da yükleyebilirsin.",
      onUploaded: (path) => { m.image = path; },
    }));

    row.appendChild(body);
    return row;
  }

  function buildMusicSpotifyBlock(m, titleSpan, rowEl) {
    const container = C.el("div", { className: "field activities-channel-url-block" });
    container.appendChild(C.el("label", { text: "Spotify URL (otomatik doldurma)" }));

    const urlRow = C.el("div", { className: "activities-url-row" });

    const preview = C.el("div", { className: "channel-avatar-preview" });
    function renderPreview() {
      preview.innerHTML = "";
      const src = m.image && /^https?:/.test(m.image)
        ? m.image
        : m.image ? `../${m.image}?v=${Date.now()}` : "";
      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = m.title || "";
        img.onerror = () => {
          preview.innerHTML = '<i class="fa-solid fa-music"></i>';
          preview.classList.remove("has-avatar");
        };
        preview.appendChild(img);
        preview.classList.add("has-avatar");
      } else {
        preview.innerHTML = '<i class="fa-solid fa-music"></i>';
        preview.classList.remove("has-avatar");
      }
    }
    renderPreview();

    const urlInp = C.input("url", m.url, "https://open.spotify.com/track/...");
    urlInp.addEventListener("input", () => { m.url = urlInp.value.trim(); });

    const fetchBtn = C.el("button", { type: "button", className: "btn btn-ghost btn-sm", title: "Spotify'dan bilgileri getir" });
    fetchBtn.innerHTML = '<i class="fa-brands fa-spotify"></i> Getir';

    const status = C.el("span", { className: "avatar-fetch-status" });

    fetchBtn.addEventListener("click", async () => {
      const url = (urlInp.value || "").trim();
      if (!url) {
        status.textContent = "Önce Spotify URL'i yapıştırın.";
        status.className = "avatar-fetch-status err";
        return;
      }

      fetchBtn.disabled = true;
      fetchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      status.textContent = "Getiriliyor…";
      status.className = "avatar-fetch-status";

      try {
        const res = await fetch(`/api/spotify-track?url=${encodeURIComponent(url)}`);
        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(result.error || "Bulunamadı");

        // Bilgileri güncelle ve input'lara yansıt
        if (result.artist) {
          m.artist = result.artist;
          const inp = rowEl.querySelector('input[data-role="music-artist"]');
          if (inp) inp.value = result.artist;
        }
        if (result.title) {
          m.title = result.title;
          const inp = rowEl.querySelector('input[data-role="music-title"]');
          if (inp) inp.value = result.title;
        }
        if (result.image) {
          m.image = result.image;
          const inp = rowEl.querySelector('input[data-role="music-image"]');
          if (inp) {
            inp.value = result.image;
            inp.dispatchEvent(new Event("input", { bubbles: true }));
          }
          renderPreview();
        }
        titleSpan.textContent = `${m.artist || "—"} — ${m.title || "—"}`;

        status.textContent = "✓ Bilgiler dolduruldu";
        status.className = "avatar-fetch-status ok";
      } catch (err) {
        status.textContent = err.message || "Hata";
        status.className = "avatar-fetch-status err";
      } finally {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = '<i class="fa-brands fa-spotify"></i> Getir';
      }
    });

    const urlFieldWrap = C.el("div", { className: "activities-url-field" });
    urlFieldWrap.appendChild(urlInp);

    const urlBtnWrap = C.el("div", { className: "activities-url-btn-wrap" });
    urlBtnWrap.appendChild(fetchBtn);
    urlBtnWrap.appendChild(status);

    urlRow.appendChild(preview);
    urlRow.appendChild(urlFieldWrap);
    urlRow.appendChild(urlBtnWrap);

    container.appendChild(urlRow);
    return container;
  }

  /* ──────────────────────── SUB-TABS + RENDER ──────────────── */
  function buildSubnav() {
    const nav = C.el("div", { className: "activities-subnav", role: "tablist" });
    const tabs = [
      { id: "channels", label: "Kanallar", icon: "fa-youtube", brand: true },
      { id: "series",   label: "Diziler",  icon: "fa-tv" },
      { id: "music",    label: "Müzikler", icon: "fa-music" },
      { id: "books",    label: "Kütüphane (gizli)", icon: "fa-book-open" },
    ];

    tabs.forEach(t => {
      const btn = C.el("button", {
        type: "button",
        className: "activities-subnav-item" + (t.id === activeSubtab ? " is-active" : ""),
        "data-subtab": t.id,
        role: "tab",
      });
      btn.innerHTML = `<i class="${t.brand ? "fa-brands" : "fa-solid"} ${t.icon}"></i> ${t.label}`;
      btn.addEventListener("click", () => switchSubtab(t.id));
      nav.appendChild(btn);
    });

    return nav;
  }

  function switchSubtab(id) {
    activeSubtab = id;
    document.querySelectorAll(".activities-subnav-item").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.subtab === id);
    });
    document.querySelectorAll("[data-subpanel]").forEach(panel => {
      panel.hidden = panel.dataset.subpanel !== id;
    });
  }

  function render(container, data) {
    container.innerHTML = "";
    container.appendChild(buildSubnav());

    const sections = C.el("div", { className: "activities-subpanels" });
    const channelsPanel = buildChannelsSection(data);
    const seriesPanel   = buildSeriesSection(data);
    const musicPanel    = buildMusicSection(data);
    const booksPanel    = buildBooksSection(data);

    channelsPanel.hidden = activeSubtab !== "channels";
    seriesPanel.hidden   = activeSubtab !== "series";
    musicPanel.hidden    = activeSubtab !== "music";
    booksPanel.hidden    = activeSubtab !== "books";

    sections.appendChild(channelsPanel);
    sections.appendChild(seriesPanel);
    sections.appendChild(musicPanel);
    sections.appendChild(booksPanel);
    container.appendChild(sections);
  }

  return { render };
})();
