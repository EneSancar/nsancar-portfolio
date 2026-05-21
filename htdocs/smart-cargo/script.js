function goToPage(pageUrl) {
  window.location.href = pageUrl.replace(/\/+$/, "");
}

function initSmartCargoNav() {
  const hamburger = document.querySelector(".hamburger");
  const navBar = document.querySelector(".nav-bar");
  if (!hamburger || !navBar) return;

  navBar.classList.remove("active");

  hamburger.setAttribute("role", "button");
  hamburger.setAttribute("aria-label", "Menüyü aç/kapat");
  hamburger.setAttribute("aria-expanded", "false");

  hamburger.addEventListener("click", () => {
    const open = navBar.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navBar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 800) {
        navBar.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      navBar.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });

  const page = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = navBar.querySelectorAll("ul li a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isCurrent =
      href === page ||
      (page === "" && href === "index.html") ||
      (href && href.endsWith(page));
    link.classList.toggle("active", !!isCurrent);
  });
}

document.addEventListener("DOMContentLoaded", initSmartCargoNav);
