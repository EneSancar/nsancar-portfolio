(function () {
  const DATA_URL = "data/video-edits.json";
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
    section.className = "projects-section video-edits-section reveal";
    section.dataset.sectionId = "video-edits";

    section.innerHTML = `
      <h2 class="projects-section-title">
        <i class="fa-solid fa-clapperboard"></i> Video Edit / After Effects
      </h2>
      <p class="video-edits-intro">${escapeHtml(data.intro || "")}</p>
    `;

    const edits = SC.asArray(data.edits).filter((e) => e && parseYoutubeId(e.youtubeUrl));
    if (!edits.length) {
      const empty = document.createElement("p");
      empty.className = "video-edits-empty content-empty";
      empty.textContent = "Henüz edit eklenmedi.";
      section.appendChild(empty);
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
          <iframe class="video-edits-frame" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
        </div>
        <p class="video-edits-slide-title"></p>
      </div>
      <button type="button" class="video-edits-nav video-edits-nav--next" aria-label="Sonraki">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div class="video-edits-dots" role="tablist" aria-label="Slayt seçimi"></div>
    `;

    section.appendChild(carousel);
    initCarousel(carousel, edits, Number(data.autoplayMs) || 7500);
    return section;
  }

  function initCarousel(root, edits, intervalMs) {
    const iframe = root.querySelector(".video-edits-frame");
    const titleEl = root.querySelector(".video-edits-slide-title");
    const dotsWrap = root.querySelector(".video-edits-dots");
    const prevBtn = root.querySelector(".video-edits-nav--prev");
    const nextBtn = root.querySelector(".video-edits-nav--next");

    let index = 0;
    let timer = null;
    let paused = false;

    edits.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "video-edits-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slayt ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function embedUrl(videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    }

    function goTo(i) {
      index = ((i % edits.length) + edits.length) % edits.length;
      const edit = edits[index];
      const videoId = parseYoutubeId(edit.youtubeUrl);
      if (!videoId) return;

      iframe.src = embedUrl(videoId);
      titleEl.textContent = edit.title || "";

      dotsWrap.querySelectorAll(".video-edits-dot").forEach((d, di) => {
        d.classList.toggle("is-active", di === index);
        d.setAttribute("aria-selected", di === index ? "true" : "false");
      });
    }

    function startTimer() {
      stopTimer();
      if (edits.length <= 1 || paused) return;
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

    goTo(0);
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
