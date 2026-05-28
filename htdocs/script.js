/* ===== Typed.js ===== */
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
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
  initLibraryFilter();
  initSeriesFilter();
  initTheme();
  initContactForm();
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
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const slugMap = {
    "/hakkimda":    "/hakkimda",
    "/projeler":    "/projeler",
    "/servisler":   "/servisler",
    "/aktiviteler": "/aktiviteler",
  };
  const currentSlug = slugMap[path] || path;

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    const isHome = (href === "/" || href === "/index.html") && (path === "/" || path === "");
    const isMatch = href === currentSlug || isHome;
    link.classList.toggle("active", isMatch);
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
let nsancarRevealObserver = null;

function getRevealObserver() {
  if (nsancarRevealObserver) return nsancarRevealObserver;

  nsancarRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          nsancarRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  return nsancarRevealObserver;
}

function initReveal() {
  const reveals = document.querySelectorAll(".reveal:not([data-reveal-bound])");
  if (!reveals.length) return;

  const observer = getRevealObserver();
  reveals.forEach((el) => {
    el.dataset.revealBound = "1";
    observer.observe(el);
  });
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

  function getTemplate(key) {
    return document.getElementById(`project-detail-${key}`);
  }

  function openModal(key) {
    const tpl = getTemplate(key);
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

  if (!modal.dataset.bound) {
    modal.dataset.bound = "true";

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".project-detail-btn");
      if (btn?.dataset.project) openModal(btn.dataset.project);
    });

    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }
}

window.nsancarInitProjectModal = initProjectModal;
window.nsancarInitReveal = initReveal;

/* ===== Status filters (library, series on fav page) ===== */
function initStatusFilter(sectionId, filterSelector, cardSelector, countEl, countLabel, gridId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const grid = gridId ? document.getElementById(gridId) : null;
  const cards = () => Array.from((grid || section).querySelectorAll(cardSelector));
  const filters = section.querySelectorAll(filterSelector);

  function updateCount() {
    if (!countEl) return;
    const total = cards().length;
    countEl.textContent = total === 1 ? `1 ${countLabel}` : `${total} ${countLabel}`;
  }

  function applyFilter(status) {
    cards().forEach((card) => {
      card.hidden = status !== "all" && card.dataset.status !== status;
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.dataset.filter;
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      applyFilter(status);
    });
  });

  updateCount();
}

function initLibraryFilter() {
  const countEl = document.getElementById("libraryCount");
  initStatusFilter("library", ".library-filter", ".book-card", countEl, "kitap", "libraryGrid");
}

function initSeriesFilter() {
  const countEl = document.getElementById("seriesCount");
  initStatusFilter("series", ".series-filter", ".series-card", countEl, "dizi", "seriesGrid");
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
  const starColors = ["#ffffff", "#c7d2fe", "#a5f3fc", "#e0e7ff", "#67e8f9"];

  let width = 0, height = 0;
  let particles = [], nodes = [], rafId = 0;
  let running = true;

  function isLight() {
    return document.documentElement.dataset.theme === "light";
  }

  /* ---- dark mode: star particles ---- */
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
      color: starColors[Math.floor(Math.random() * starColors.length)],
    };
  }

  /* ---- light mode: geo nodes ---- */
  function createNode() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 1.5 + Math.random() * 1.5,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = window.innerWidth < 768 ? 48 : 90;
    particles = Array.from({ length: count }, createParticle);
    const nodeCount = window.innerWidth < 768 ? 28 : 55;
    nodes = Array.from({ length: nodeCount }, createNode);
  }

  function drawDark() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (!reducedMotion) {
        p.x += p.vx; p.y += p.vy;
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
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      if (p.depth > 0.72 && p.radius > 1.4) {
        ctx.beginPath();
        ctx.globalAlpha = alpha * 0.25;
        ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawLight() {
    ctx.clearRect(0, 0, width, height);
    if (!reducedMotion) {
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = width; if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height; if (n.y > height) n.y = 0;
      }
    }
    const linkDist = 160;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.beginPath();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#6366f1";
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    if (!running) return;
    if (isLight()) drawLight(); else drawDark();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  loop();

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) loop(); else cancelAnimationFrame(rafId);
  });

  /* Expose so theme toggle can trigger a re-style immediately */
  window._reinitParticles = resize;
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

/* ===== Theme toggle ===== */
function initTheme() {
  const saved = localStorage.getItem("ns-theme") || "dark";
  applyTheme(saved, false);

  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next, true);
    localStorage.setItem("ns-theme", next);
  });
}

function applyTheme(theme, animate) {
  const html = document.documentElement;
  if (animate) {
    html.classList.add("theme-transitioning");
    setTimeout(() => html.classList.remove("theme-transitioning"), 400);
  }
  html.dataset.theme = theme;
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.innerHTML = theme === "light"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
    btn.setAttribute("aria-label", theme === "light" ? "Koyu tema" : "Açık tema");
  }
  if (window._reinitParticles) window._reinitParticles();
}

/* ===== Preloader ===== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  if (typeof lottie !== "undefined") {
    lottie.loadAnimation({
      container: document.getElementById("lottieCont"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/lottie/loader.json",
    });
  }

  const startedAt = Date.now();
  const MIN_DISPLAY = 900;

  function hidePreloader() {
    const elapsed = Date.now() - startedAt;
    const delay = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(() => {
      preloader.classList.add("is-hiding");
      setTimeout(() => preloader.remove(), 600);
    }, delay);
  }

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader, { once: true });
  }
}

/* ===== Contact form ===== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  const btn = form?.querySelector(".contact-form-btn");
  if (!form || !status || !btn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lang = localStorage.getItem("ns-lang") || "tr";
    const dict = (window.LANG && window.LANG[lang]) || {};

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const subject = form.querySelector('[name="subject"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();
    const honey = form.querySelector('[name="_honey"]')?.value;

    if (!name || !email || !message) return;

    btn.disabled = true;
    btn.textContent = dict["contact.form.sending"] || "Gönderiliyor…";
    status.textContent = "";
    status.className = "contact-form-status";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, _honey: honey }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        status.textContent = dict["contact.form.success"] || "Mesajın iletildi, teşekkürler!";
        status.className = "contact-form-status is-success";
        form.reset();
      } else {
        throw new Error(data.error || "error");
      }
    } catch {
      status.textContent = dict["contact.form.error"] || "Bir hata oluştu. Lütfen tekrar deneyin.";
      status.className = "contact-form-status is-error";
    } finally {
      btn.disabled = false;
      btn.textContent = dict["contact.form.send"] || "Gönder";
    }
  });
}
