/* ===== Typed.js ===== */
document.addEventListener("DOMContentLoaded", () => {
  const typedEl = document.querySelector(".auto-type");
  if (typedEl && typeof Typed !== "undefined") {
    new Typed(".auto-type", {
      strings: ["Coding", "travelling", "discovering"],
      typeSpeed: 80,
      backSpeed: 60,
      loop: true,
    });
  }

  initNav();
  initHeaderScroll();
  initReveal();
  initSkillBars();
  initStaggerRows();
  initGalleryPanels();
  initMovieShowcase();
  initProjectModal();
  setActiveNavLink();
  initSpaceParticles();
  initHeroEntrance();
});

/* ===== Navigation ===== */
function initNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

function setActiveNavLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ===== Header scroll behavior ===== */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset;
    header.classList.toggle("scrolled", current > 40);

    if (current > lastScroll && current > 120) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }
    lastScroll = current;
  }, { passive: true });
}

/* ===== Scroll reveal ===== */
function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ===== Staggered row reveals (skills, quick cards, contact) ===== */
function initStaggerRows() {
  const rows = [
    { selector: ".skill-icons", visibleClass: "skill-icons--visible" },
    { selector: ".cards-row", visibleClass: "cards-row--visible" },
    { selector: ".contact-row", visibleClass: "contact-row--visible" },
  ];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rows.forEach(({ selector, visibleClass }) => {
    const row = document.querySelector(selector);
    if (!row) return;

    if (reducedMotion) {
      row.classList.add(visibleClass);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            row.classList.add(visibleClass);
            observer.unobserve(row);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(row);
  });
}

/* ===== Skill bars ===== */
function initSkillBars() {
  const fills = document.querySelectorAll(".skill-bar-fill");
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.setProperty("--level", fill.dataset.level);
          fill.classList.add("animate");
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach((fill) => observer.observe(fill));
}

/* ===== Gallery panels ===== */
function initGalleryPanels() {
  const webPanel = document.getElementById("webPanel");
  const graphicPanel = document.getElementById("graphicPanel");
  if (!webPanel || !graphicPanel) return;

  webPanel.addEventListener("mouseenter", () => {
    webPanel.classList.add("expanded");
    webPanel.classList.remove("collapsed");
    graphicPanel.classList.add("collapsed");
    graphicPanel.classList.remove("expanded");
  });

  graphicPanel.addEventListener("mouseenter", () => {
    graphicPanel.classList.add("expanded");
    graphicPanel.classList.remove("collapsed");
    webPanel.classList.add("collapsed");
    webPanel.classList.remove("expanded");
  });

  document.getElementById("gallerySplit")?.addEventListener("mouseleave", () => {
    webPanel.classList.add("expanded");
    webPanel.classList.remove("collapsed");
    graphicPanel.classList.remove("expanded", "collapsed");
  });
}

/* ===== Movie showcase ===== */
function initMovieShowcase() {
  const rail = document.getElementById("movieRail");
  const thumbs = rail ? [...rail.querySelectorAll(".movie-thumb")] : [];
  if (!thumbs.length) return;

  const featured = document.querySelector(".movie-featured");
  const img = document.getElementById("movieFeaturedImg");
  const rank = document.getElementById("movieFeaturedRank");
  const title = document.getElementById("movieFeaturedTitle");
  const genres = document.getElementById("movieFeaturedGenres");
  const rating = document.getElementById("movieFeaturedRating");
  const year = document.getElementById("movieFeaturedYear");
  const prevBtn = document.getElementById("moviePrev");
  const nextBtn = document.getElementById("movieNext");

  let activeIndex = thumbs.findIndex((t) => t.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;

  function renderGenres(raw) {
    if (!genres) return;
    genres.innerHTML = "";
    raw.split(",").forEach((g) => {
      const chip = document.createElement("span");
      chip.className = "movie-genre-chip";
      chip.textContent = g.trim();
      genres.appendChild(chip);
    });
  }

  function selectMovie(index) {
    const i = ((index % thumbs.length) + thumbs.length) % thumbs.length;
    const thumb = thumbs[i];
    activeIndex = i;

    thumbs.forEach((t, idx) => {
      const on = idx === i;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });

    featured?.classList.add("is-changing");

    window.setTimeout(() => {
      if (img) {
        img.src = thumb.dataset.poster;
        img.alt = thumb.dataset.title;
      }
      if (rank) rank.textContent = `#${i + 1}`;
      if (title) title.textContent = thumb.dataset.title;
      if (rating) {
        rating.innerHTML = `<i class="fa-solid fa-star"></i> ${thumb.dataset.rating}`;
      }
      if (year) year.textContent = thumb.dataset.year;
      renderGenres(thumb.dataset.genres || "");
      featured?.classList.remove("is-changing");
    }, 180);

    thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener("click", () => selectMovie(idx));
  });

  prevBtn?.addEventListener("click", () => selectMovie(activeIndex - 1));
  nextBtn?.addEventListener("click", () => selectMovie(activeIndex + 1));

  renderGenres(thumbs[activeIndex].dataset.genres || "");
}

/* ===== Project detail modal ===== */
function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const content = document.getElementById("projectModalContent");
  if (!modal || !content) return;

  const templates = {
    cineforum: document.getElementById("project-detail-cineforum"),
    fotoeyes: document.getElementById("project-detail-fotoeyes"),
    suppworld: document.getElementById("project-detail-suppworld"),
    akim: document.getElementById("project-detail-akim"),
    smartcargo: document.getElementById("project-detail-smartcargo"),
    nsancar: document.getElementById("project-detail-nsancar"),
    timetracker: document.getElementById("project-detail-timetracker"),
    iku: document.getElementById("project-detail-iku"),
  };

  function openModal(key) {
    const tpl = templates[key];
    if (!tpl) return;
    content.innerHTML = "";
    content.appendChild(tpl.content.cloneNode(true));
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project-detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.project));
  });

  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
}

/* ===== Hero entrance ===== */
function initHeroEntrance() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.classList.add("is-ready");
    return;
  }

  requestAnimationFrame(() => {
    hero.classList.add("is-ready");
  });
}

/* ===== Homepage space particles ===== */
function initSpaceParticles() {
  const canvas = document.getElementById("spaceParticles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["#ffffff", "#c7d2fe", "#a5f3fc", "#e0e7ff", "#67e8f9"];
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;
  let running = true;
  let mouseX = 0.5;
  let mouseY = 0.5;

  function particleCount() {
    return window.innerWidth < 768 ? 48 : 90;
  }

  function createParticle() {
    const depth = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      radius: 0.4 + depth * 1.8 + Math.random() * 0.8,
      opacity: 0.15 + depth * 0.55,
      vx: (Math.random() - 0.5) * (0.08 + depth * 0.22),
      vy: (Math.random() - 0.5) * (0.08 + depth * 0.22),
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.008 + Math.random() * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount() }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const parallaxX = (mouseX - 0.5) * 18;
    const parallaxY = (mouseY - 0.5) * 18;

    for (const p of particles) {
      let x = p.x + parallaxX * (1 - p.depth);
      let y = p.y + parallaxY * (1 - p.depth);

      if (!reducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      const twinkle = reducedMotion ? 1 : 0.65 + Math.sin(p.twinkle) * 0.35;
      const alpha = p.opacity * twinkle;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.depth > 0.72 && p.radius > 1.4) {
        ctx.beginPath();
        ctx.globalAlpha = alpha * 0.25;
        ctx.arc(x, y, p.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }

  function loop() {
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  loop();

  window.addEventListener("resize", resize);

  if (!reducedMotion) {
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX / width;
        mouseY = e.clientY / height;
      },
      { passive: true }
    );
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      loop();
    } else {
      cancelAnimationFrame(rafId);
    }
  });
}

/* ===== Email toast ===== */
function showEmail() {
  const bar = document.getElementById("emailbar");
  if (!bar) return;
  bar.classList.add("show");
  clearTimeout(showEmail._timer);
  showEmail._timer = setTimeout(() => bar.classList.remove("show"), 7000);
}

/* Legacy helpers (other pages may still reference these) */
function myFunctionEmail() {
  showEmail();
}
