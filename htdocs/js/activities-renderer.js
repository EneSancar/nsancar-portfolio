(function () {
  const DATA_URL = "/data/activities.json";

  const STATUS_LABELS = {
    watching: "İzliyorum",
    finished: "Bitirdim",
    wishlist: "Listemde",
    reading: "Okuyorum",
  };

  function fetchData() {
    return fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
  }

  /* ── CHANNELS ──────────────────────────────────────────────── */
  function renderChannels(channels) {
    const grid = document.getElementById("channelGrid");
    const badge = document.getElementById("channelCount");
    if (!grid) return;

    if (!channels || !channels.length) {
      grid.innerHTML =
        '<p class="library-empty-inline"><i class="fa-solid fa-circle-info"></i> Henüz kanal eklenmedi.</p>';
      if (badge) badge.textContent = "0 kanal";
      return;
    }

    if (badge) badge.textContent = `${channels.length} kanal`;

    grid.innerHTML = channels
      .map((ch) => {
        const avatarHtml = ch.avatar
          ? `<div class="channel-avatar channel-avatar--photo" aria-hidden="true">
               <img src="${escHtml(ch.avatar)}" alt="${escHtml(ch.name)}" loading="lazy">
             </div>`
          : `<div class="channel-avatar channel-avatar--yt" aria-hidden="true">
               <i class="fa-brands fa-youtube"></i>
             </div>`;
        return `
        <a href="${escHtml(ch.url || "#")}" class="channel-card" target="_blank" rel="noopener">
          ${avatarHtml}
          <div class="channel-body">
            ${ch.tag ? `<span class="channel-tag">${escHtml(ch.tag)}</span>` : ""}
            <h3 class="channel-name">${escHtml(ch.name)}</h3>
            ${ch.description ? `<p class="channel-desc">${escHtml(ch.description).replace(/\n/g, "<br>")}</p>` : ""}
          </div>
          <span class="channel-go" aria-hidden="true"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
        </a>`;
      })
      .join("");
  }

  /* ── SERIES ────────────────────────────────────────────────── */
  function starHtml(rating) {
    const n = Math.min(5, Math.max(0, Math.round(rating || 0)));
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += i <= n
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }

  function renderSeries(series) {
    const grid = document.getElementById("seriesGrid");
    const badge = document.getElementById("seriesCount");
    if (!grid) return;

    const allItems = series || [];
    if (badge) badge.textContent = `${allItems.length} dizi`;

    if (!allItems.length) {
      grid.innerHTML =
        '<p class="library-empty-inline"><i class="fa-solid fa-circle-info"></i> Henüz dizi eklenmedi.</p>';
      return;
    }

    grid.innerHTML = allItems
      .map((s) => {
        const statusClass = `series-status--${s.status || "wishlist"}`;
        const label = STATUS_LABELS[s.status] || s.status;
        const posterHtml = s.poster
          ? `<img src="${escHtml(s.poster)}" alt="${escHtml(s.title)}" loading="lazy">`
          : `<div class="series-poster-placeholder"><i class="fa-solid fa-tv"></i></div>`;
        return `
        <article class="series-card" data-status="${escHtml(s.status || "wishlist")}">
          <div class="series-poster">${posterHtml}</div>
          <div class="series-body">
            <span class="series-status ${statusClass}">${label}</span>
            <h3 class="series-title">${escHtml(s.title)}</h3>
            ${s.meta ? `<p class="series-meta">${escHtml(s.meta)}</p>` : ""}
            <div class="series-rating">${starHtml(s.rating)}</div>
          </div>
        </article>`;
      })
      .join("");

    bindSeriesFilter();
  }

  function bindSeriesFilter() {
    const filters = document.querySelectorAll(".series-filter");
    const grid = document.getElementById("seriesGrid");
    if (!filters.length || !grid) return;

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.dataset.filter;
        grid.querySelectorAll(".series-card").forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.status !== filter;
        });
      });
    });
  }

  /* ── BOOKS ─────────────────────────────────────────────────── */
  function renderBooks(books) {
    const grid = document.getElementById("libraryGrid");
    const emptyEl = document.getElementById("libraryEmpty");
    const badge = document.getElementById("libraryCount");
    if (!grid) return;

    const allBooks = books || [];
    if (badge) badge.textContent = `${allBooks.length} kitap`;

    if (!allBooks.length) {
      if (emptyEl) emptyEl.hidden = false;
      grid.innerHTML = "";
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    grid.innerHTML = allBooks
      .map((b) => {
        const statusClass = `book-status--${b.status || "wishlist"}`;
        const label = STATUS_LABELS[b.status] || b.status;
        const coverHtml = b.cover
          ? `<img src="${escHtml(b.cover)}" alt="${escHtml(b.title)}" loading="lazy">`
          : `<div class="book-cover-placeholder"><i class="fa-solid fa-book"></i></div>`;
        return `
        <article class="book-card" data-status="${escHtml(b.status || "wishlist")}">
          <div class="book-cover">${coverHtml}</div>
          <div class="book-body">
            <span class="book-status ${statusClass}">${label}</span>
            <h3 class="book-title">${escHtml(b.title)}</h3>
            ${b.author ? `<p class="book-author">${escHtml(b.author)}</p>` : ""}
            <div class="book-rating">${starHtml(b.rating)}</div>
            ${b.note ? `<p class="book-note">${escHtml(b.note)}</p>` : ""}
          </div>
        </article>`;
      })
      .join("");

    bindLibraryFilter();
  }

  function bindLibraryFilter() {
    const filters = document.querySelectorAll(".library-filter:not(.series-filter)");
    const grid = document.getElementById("libraryGrid");
    if (!filters.length || !grid) return;

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.dataset.filter;
        grid.querySelectorAll(".book-card").forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.status !== filter;
        });
      });
    });
  }

  function escHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── MUSIC ─────────────────────────────────────────────────── */
  function renderMusic(music) {
    const grid = document.getElementById("musicGrid");
    if (!grid) return;

    if (!music || !music.length) {
      grid.innerHTML = "";
      return;
    }

    grid.innerHTML = music
      .map((m) => {
        const imgSrc = m.image && /^https?:/.test(m.image) ? m.image : m.image || "";
        const imgHtml = imgSrc
          ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(m.artist)}" loading="lazy">`
          : `<div class="music-track-placeholder"><i class="fa-solid fa-music"></i></div>`;
        return `
        <div class="music-track">
          ${imgHtml}
          <div class="music-track-info">
            <h4>${escHtml(m.artist)}</h4>
            <p><i class="fa-solid fa-heart heart"></i> ${escHtml(m.title)}</p>
          </div>
        </div>`;
      })
      .join("");
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  fetchData()
    .then((data) => {
      renderMusic(data.music || []);
      renderChannels(data.channels || []);
      renderSeries(data.series || []);
      renderBooks(data.books || []);
    })
    .catch((err) => {
      console.warn("activities.json yüklenemedi:", err);
    });
})();
