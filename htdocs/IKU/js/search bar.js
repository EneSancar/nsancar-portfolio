const courses = [
  { name: 'Türk Dili-II', file: 'Türk-Dili.html', icon: 'fa-pen-nib' },
  { name: 'Atatürk İlkeleri ve İnkılap Tarihi-II', file: 'Inkılap.html', icon: 'fa-book' },
  { name: 'Blok Zincir', file: 'Blok-Zincir.html', icon: 'fa-cubes' },
  { name: 'Yazılım Güvenliği', file: 'Yazılım-Güvenliği.html', icon: 'fa-chalkboard-user' },
  { name: 'Veri Tabanı Yönetim Sistemleri-II', file: 'Veri-Tabani.html', icon: 'fa-database' },
  { name: 'Kariyer Gelişimi', file: 'Kariyer-Gelişimi.html', icon: 'fa-user-tie' },
  { name: 'Öğrenim Yönetim Sistemleri', file: 'öys.html', icon: 'fa-chalkboard-user' },
  { name: 'İngilizce-II', file: 'Ingilizce.html', icon: 'fa-language' },
  { name: 'İş Sağlığı ve Güvenliği', file: 'iş-sağlıği.html', icon: 'fa-helmet-safety' }
];

function courseHref(file) {
  const path = window.location.pathname.replace(/\\/g, '/');
  const inDersler = path.includes('/dersler/');
  return inDersler ? file : 'dersler/' + file;
}

let activeResultIndex = -1;

function getResultLinks() {
  const container = document.getElementById('searchResults');
  if (!container) return [];
  return Array.from(container.querySelectorAll('a.search-result-item'));
}

function setActiveResult(index) {
  const links = getResultLinks();
  if (!links.length) return;
  activeResultIndex = ((index % links.length) + links.length) % links.length;
  links.forEach((link, i) => link.classList.toggle('is-active', i === activeResultIndex));
  links[activeResultIndex].scrollIntoView({ block: 'nearest' });
}

function searchCourses() {
  const input = document.getElementById('dersArama');
  const resultsContainer = document.getElementById('searchResults');
  if (!input || !resultsContainer) return;

  const filter = input.value.trim().toUpperCase();
  resultsContainer.innerHTML = '';
  activeResultIndex = -1;

  if (filter.length < 2) {
    resultsContainer.style.display = 'none';
    return;
  }

  const filteredCourses = courses.filter((course) =>
    course.name.toUpperCase().includes(filter)
  );

  if (filteredCourses.length > 0) {
    filteredCourses.forEach((course) => {
      const resultItem = document.createElement('a');
      resultItem.href = courseHref(course.file);
      resultItem.className = 'search-result-item';
      resultItem.innerHTML = `<i class="fas ${course.icon}"></i>${course.name}`;
      resultsContainer.appendChild(resultItem);
    });
    resultsContainer.style.display = 'block';
  } else {
    const empty = document.createElement('div');
    empty.className = 'search-result-item search-no-result';
    empty.textContent = 'Sonuç bulunamadı';
    resultsContainer.appendChild(empty);
    resultsContainer.style.display = 'block';
  }
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-container')) {
    const results = document.getElementById('searchResults');
    if (results) results.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('dersArama');
  if (!input) return;

  input.addEventListener('keydown', function (e) {
    const links = getResultLinks();
    if (e.key === 'Escape') {
      document.getElementById('searchResults').style.display = 'none';
      return;
    }
    if (!links.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResult(activeResultIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResult(activeResultIndex - 1);
    } else if (e.key === 'Enter' && activeResultIndex >= 0) {
      e.preventDefault();
      links[activeResultIndex].click();
    }
  });
});
