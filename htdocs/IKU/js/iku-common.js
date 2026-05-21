function toggleMenu() {
  const links = document.getElementById('nav-links');
  if (!links) return;
  links.classList.toggle('is-open');
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', links.classList.contains('is-open'));
  }
}

document.addEventListener('click', function (e) {
  const links = document.getElementById('nav-links');
  if (!links || !links.classList.contains('is-open')) return;
  if (!e.target.closest('#navbar')) {
    links.classList.remove('is-open');
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }
});
