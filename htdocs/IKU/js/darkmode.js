function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById('darkModeToggle');
  const isDarkMode = body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDarkMode
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }
}

function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;

  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  darkModeToggle.addEventListener('click', toggleDarkMode);
}

window.addEventListener('load', () => {
  if (typeof HackerText !== 'undefined') {
    document.querySelectorAll('.hackerText').forEach((el) => new HackerText(el));
  }
  initDarkMode();
});
