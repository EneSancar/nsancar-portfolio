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
  initGalleryPanels();
  initMovieShowcase();
  setActiveNavLink();
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
