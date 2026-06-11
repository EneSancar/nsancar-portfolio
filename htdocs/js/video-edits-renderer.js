(function () {
  const DATA_URL = "data/video-edits.json";
  const VIDEO_EDITS_BG = "image/video-edits-bg.gif";
  const SC = window.SiteContent;
  const INSERT_AFTER = "graphic";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

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

  function applySectionBackgroundWhenVisible(section, bgPath) {
    const safeUrl = bgPath.replace(/"/g, '\\"');
    let applied = false;

    function apply() {
      if (applied) return;
      applied = true;
      section.style.backgroundImage = `url("${safeUrl}")`;
    }

    if (!("IntersectionObserver" in window)) {
      apply();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          apply();
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 }
    );
    observer.observe(section);
  }

  function ensureCardPoster(card, edit) {
    const img = card.querySelector(".video-edits-poster-img");
    if (!img || img.dataset.posterLoaded === "1") return;
    const videoId = parseYoutubeId(edit?.youtubeUrl);
    if (!videoId) return;
    img.dataset.posterLoaded = "1";
    setPosterImage(img, videoId, edit?.title || "Video önizlemesi");
  }

  function buildSection(data) {
    const section = document.createElement("section");
    section.className = "projects-section video-edits-section";
    section.id = "video-edits";
    section.dataset.sectionId = "video-edits";

    const bgPath = String(data.backgroundImage || "").trim() || VIDEO_EDITS_BG;
    section.classList.add("video-edits-section--has-bg");
    applySectionBackgroundWhenVisible(section, bgPath);

    const bgWrap = document.createElement("div");
    bgWrap.className = "video-edits-bg";
    bgWrap.setAttribute("aria-hidden", "true");

    const bgOverlay = document.createElement("div");
    bgOverlay.className = "video-edits-bg-overlay";

    bgWrap.appendChild(bgOverlay);
    section.appendChild(bgWrap);

    const content = document.createElement("div");
    content.className = "video-edits-content reveal";
    content.innerHTML = `
      <h2 class="projects-section-title">
        <i class="fa-solid fa-clapperboard"></i> Video Edit / After Effects
      </h2>
      <p class="video-edits-intro">${escapeHtml(data.intro || "")}</p>
    `;
    section.appendChild(content);

    const edits = SC.asArray(data.edits).filter((e) => e && parseYoutubeId(e.youtubeUrl));
    if (!edits.length) {
      const empty = document.createElement("p");
      empty.className = "video-edits-empty content-empty";
      empty.textContent = "Henüz edit eklenmedi.";
      content.appendChild(empty);
      return section;
    }

    const carousel = document.createElement("div");
    carousel.className = "video-edits-carousel";
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-label", "Video edit slaytı");

    carousel.innerHTML = `
      <button type="button" class="video-edits-nav video-edits-nav--prev" aria-label="Önceki">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <div class="video-edits-carousel-container">
        <div class="video-edits-track"></div>
      </div>
      <button type="button" class="video-edits-nav video-edits-nav--next" aria-label="Sonraki">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="video-edits-member-info">
        <h3 class="video-edits-slide-title"></h3>
      </div>
      <div class="video-edits-dots" role="tablist" aria-label="Slayt seçimi"></div>
    `;

    const track = carousel.querySelector(".video-edits-track");
    edits.forEach((edit, i) => {
      const videoId = parseYoutubeId(edit.youtubeUrl);
      if (!videoId) return;

      const card = document.createElement("div");
      card.className = "video-edits-card";
      card.dataset.index = String(i);

      const frameWrap = document.createElement("div");
      frameWrap.className = "video-edits-frame-wrap";

      const posterBtn = document.createElement("button");
      posterBtn.type = "button";
      posterBtn.className = "video-edits-poster";
      posterBtn.setAttribute("aria-label", `${edit.title || "Video"} oynat`);

      const posterImg = document.createElement("img");
      posterImg.className = "video-edits-poster-img";
      posterImg.alt = edit.title || "Video önizlemesi";
      posterImg.loading = "lazy";
      posterImg.decoding = "async";
      setPosterImage(posterImg, videoId, edit.title || "Video önizlemesi");

      const playBtn = document.createElement("span");
      playBtn.className = "video-edits-play-btn";
      playBtn.setAttribute("aria-hidden", "true");
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

      const iframe = document.createElement("iframe");
      iframe.className = "video-edits-frame";
      iframe.title = edit.title || "YouTube video";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.hidden = true;

      posterBtn.appendChild(posterImg);
      posterBtn.appendChild(playBtn);
      frameWrap.appendChild(posterBtn);
      frameWrap.appendChild(iframe);
      card.appendChild(frameWrap);
      track.appendChild(card);
    });

    content.appendChild(carousel);
    initCarousel(carousel, edits, Number(data.autoplayMs) || 7500, section);
    return section;
  }

  function setPosterImage(imgEl, videoId, altText) {
    const candidates = [
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    ];

    function tryLoad(idx) {
      if (idx >= candidates.length) return;
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth < 200 && idx < candidates.length - 1) {
          tryLoad(idx + 1);
          return;
        }
        imgEl.src = candidates[idx];
        imgEl.alt = altText;
      };
      probe.onerror = () => tryLoad(idx + 1);
      probe.src = candidates[idx];
    }

    tryLoad(0);
  }

  function initCarousel(root, edits, intervalMs, section) {
    const track = root.querySelector(".video-edits-track");
    const cards = Array.from(root.querySelectorAll(".video-edits-card"));
    const titleEl = root.querySelector(".video-edits-slide-title");
    const dotsWrap = root.querySelector(".video-edits-dots");
    const prevBtn = root.querySelector(".video-edits-nav--prev");
    const nextBtn = root.querySelector(".video-edits-nav--next");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animMs = reducedMotion ? 0 : 800;

    let index = 0;
    let timer = null;
    let paused = false;
    let inView = false;
    let isPlaying = false;
    let isAnimating = false;

    if (edits.length <= 1) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
    }

    edits.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "video-edits-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slayt ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(i);
        startTimer();
      });
      dotsWrap.appendChild(dot);
    });

    if (edits.length <= 1) {
      dotsWrap.hidden = true;
    }

    function embedUrl(videoId, autoplay) {
      const base = `https://www.youtube.com/embed/${videoId}?rel=0`;
      return autoplay ? `${base}&autoplay=1` : base;
    }

    function getCenterCard() {
      return track.querySelector(".video-edits-card.center");
    }

    function currentVideoId() {
      return parseYoutubeId(edits[index]?.youtubeUrl);
    }

    function updatePositions() {
      cards.forEach((card, i) => {
        let diff = i - index;
        const half = cards.length / 2;
        if (diff > half) diff -= cards.length;
        else if (diff < -half) diff += cards.length;

        card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

        if (diff === 0) card.classList.add("center");
        else if (diff === 1) card.classList.add("right-1");
        else if (diff === 2) card.classList.add("right-2");
        else if (diff === -1) card.classList.add("left-1");
        else if (diff === -2) card.classList.add("left-2");
        else card.classList.add("hidden");
      });

      cards.forEach((card, i) => {
        if (!card.classList.contains("hidden")) {
          ensureCardPoster(card, edits[i]);
        }
      });

      dotsWrap.querySelectorAll(".video-edits-dot").forEach((d, di) => {
        d.classList.toggle("is-active", di === index);
        d.setAttribute("aria-selected", di === index ? "true" : "false");
      });
    }

    function updateTitle() {
      const edit = edits[index];
      titleEl.style.opacity = "0";
      window.setTimeout(() => {
        titleEl.textContent = edit?.title || "";
        titleEl.style.opacity = "1";
      }, reducedMotion ? 0 : 250);
    }

    function stopAllPlayers() {
      cards.forEach((card) => {
        const wrap = card.querySelector(".video-edits-frame-wrap");
        const posterBtn = card.querySelector(".video-edits-poster");
        const iframe = card.querySelector(".video-edits-frame");
        if (!wrap || !posterBtn || !iframe) return;
        iframe.removeAttribute("src");
        iframe.hidden = true;
        wrap.classList.remove("is-playing");
        posterBtn.hidden = false;
        posterBtn.removeAttribute("aria-hidden");
      });
      isPlaying = false;
    }

    function showPoster() {
      stopAllPlayers();
    }

    function playCurrentVideo() {
      const videoId = currentVideoId();
      const centerCard = getCenterCard();
      if (!videoId || !centerCard) return;

      const wrap = centerCard.querySelector(".video-edits-frame-wrap");
      const posterBtn = centerCard.querySelector(".video-edits-poster");
      const iframe = centerCard.querySelector(".video-edits-frame");
      if (!wrap || !posterBtn || !iframe) return;

      isPlaying = true;
      stopTimer();
      wrap.classList.add("is-playing");
      posterBtn.hidden = true;
      posterBtn.setAttribute("aria-hidden", "true");
      iframe.hidden = false;
      iframe.src = embedUrl(videoId, true);
    }

    function goTo(i) {
      if (isAnimating) return;
      const nextIndex = ((i % edits.length) + edits.length) % edits.length;
      if (!edits[nextIndex] || !parseYoutubeId(edits[nextIndex].youtubeUrl)) return;
      if (nextIndex === index && !isPlaying) return;

      isAnimating = true;
      showPoster();
      index = nextIndex;
      updatePositions();
      updateTitle();

      window.setTimeout(() => {
        isAnimating = false;
      }, animMs);
    }

    function startTimer() {
      stopTimer();
      if (!inView || edits.length <= 1 || paused || isPlaying) return;
      timer = window.setInterval(() => goTo(index + 1), intervalMs);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    prevBtn.addEventListener("click", () => {
      goTo(index - 1);
      startTimer();
    });

    nextBtn.addEventListener("click", () => {
      goTo(index + 1);
      startTimer();
    });

    cards.forEach((card) => {
      const cardIndex = Number(card.dataset.index);
      const posterBtn = card.querySelector(".video-edits-poster");

      card.addEventListener("click", () => {
        if (!card.classList.contains("center")) {
          goTo(cardIndex);
          startTimer();
        }
      });

      posterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (card.classList.contains("center") && !isPlaying) {
          playCurrentVideo();
        }
      });
    });

    root.addEventListener("mouseenter", () => {
      paused = true;
      stopTimer();
    });

    root.addEventListener("mouseleave", () => {
      paused = false;
      startTimer();
    });

    root.addEventListener("focusin", () => {
      paused = true;
      stopTimer();
    });

    root.addEventListener("focusout", () => {
      paused = false;
      startTimer();
    });

    let touchStartX = 0;
    root.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) < 50) return;
        goTo(index + (diff > 0 ? 1 : -1));
        startTimer();
      },
      { passive: true }
    );

    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
        startTimer();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
        startTimer();
      }
    });

    const viewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inView = true;
            startTimer();
          } else {
            inView = false;
            stopTimer();
            if (isPlaying) showPoster();
          }
        });
      },
      { threshold: 0.35 }
    );

    viewObserver.observe(section);

    index = 0;
    updatePositions();
    updateTitle();
    startTimer();
  }

  function insertSection(section) {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    const anchor = container.querySelector(`[data-section-id="${INSERT_AFTER}"]`);
    if (anchor && anchor.nextSibling) {
      container.insertBefore(section, anchor.nextSibling);
    } else if (anchor) {
      anchor.insertAdjacentElement("afterend", section);
    } else {
      const web = container.querySelector('[data-section-id="web"]');
      if (web) container.insertBefore(section, web);
      else container.appendChild(section);
    }
  }

  async function loadVideoEdits() {
    try {
      const data = await SC.fetchJson(DATA_URL);
      const section = buildSection(data);
      insertSection(section);

      if (typeof window.nsancarInitReveal === "function") {
        window.nsancarInitReveal();
      }
    } catch (err) {
      console.error("video-edits.json yüklenemedi:", err);
    }
  }

  document.addEventListener("projectsRendered", loadVideoEdits);
})();
