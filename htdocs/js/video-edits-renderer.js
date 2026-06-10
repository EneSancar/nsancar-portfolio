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

  function buildSection(data) {
    const section = document.createElement("section");
    section.className = "projects-section video-edits-section";
    section.id = "video-edits";
    section.dataset.sectionId = "video-edits";

    const bgPath = String(data.backgroundImage || "").trim() || VIDEO_EDITS_BG;
    section.classList.add("video-edits-section--has-bg");
    section.style.backgroundImage = `url("${bgPath.replace(/"/g, '\\"')}")`;

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
      <div class="video-edits-stage">
        <div class="video-edits-frame-wrap">
          <button type="button" class="video-edits-poster" aria-label="Videoyu oynat">
            <img class="video-edits-poster-img" alt="" loading="lazy">
            <span class="video-edits-play-btn" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
          </button>
          <iframe class="video-edits-frame" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" hidden></iframe>
        </div>
        <p class="video-edits-slide-title"></p>
      </div>
      <button type="button" class="video-edits-nav video-edits-nav--next" aria-label="Sonraki">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="video-edits-dots" role="tablist" aria-label="Slayt seçimi"></div>
    `;

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
    const frameWrap = root.querySelector(".video-edits-frame-wrap");
    const posterBtn = root.querySelector(".video-edits-poster");
    const posterImg = root.querySelector(".video-edits-poster-img");
    const iframe = root.querySelector(".video-edits-frame");
    const titleEl = root.querySelector(".video-edits-slide-title");
    const dotsWrap = root.querySelector(".video-edits-dots");
    const prevBtn = root.querySelector(".video-edits-nav--prev");
    const nextBtn = root.querySelector(".video-edits-nav--next");

    let index = 0;
    let timer = null;
    let paused = false;
    let inView = false;
    let isPlaying = false;

    edits.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "video-edits-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slayt ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function embedUrl(videoId, autoplay) {
      const base = `https://www.youtube.com/embed/${videoId}?rel=0`;
      return autoplay ? `${base}&autoplay=1` : base;
    }

    function currentVideoId() {
      return parseYoutubeId(edits[index]?.youtubeUrl);
    }

    function updateSlideUi() {
      const edit = edits[index];
      titleEl.textContent = edit?.title || "";
      dotsWrap.querySelectorAll(".video-edits-dot").forEach((d, di) => {
        d.classList.toggle("is-active", di === index);
        d.setAttribute("aria-selected", di === index ? "true" : "false");
      });
    }

    function showPoster() {
      const videoId = currentVideoId();
      if (!videoId) return;

      isPlaying = false;
      iframe.removeAttribute("src");
      iframe.hidden = true;
      frameWrap.classList.remove("is-playing");
      posterBtn.hidden = false;
      posterBtn.removeAttribute("aria-hidden");
      setPosterImage(posterImg, videoId, edits[index]?.title || "Video önizlemesi");
    }

    function playCurrentVideo() {
      const videoId = currentVideoId();
      if (!videoId) return;

      isPlaying = true;
      stopTimer(); // Video oynarken arka planda slaytın geçmesini engeller
      frameWrap.classList.add("is-playing");
      posterBtn.hidden = true;
      posterBtn.setAttribute("aria-hidden", "true");
      iframe.hidden = false;
      iframe.src = embedUrl(videoId, true);
    }

    function goTo(i) {
      index = ((i % edits.length) + edits.length) % edits.length;
      if (!edits[index] || !currentVideoId()) return;

      updateSlideUi();
      showPoster();
    }

    function startTimer() {
      stopTimer();
      // Video oynuyorsa (isPlaying) otomatik kaymayı durdur
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

    posterBtn.addEventListener("click", playCurrentVideo);

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

    goTo(0);
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
