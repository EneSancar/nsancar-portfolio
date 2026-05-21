// Dark mode fonksiyonunu ekleyin
function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById('darkModeToggle');
  const isDarkMode = body.classList.toggle('dark-mode');
  
  // LocalStorage'a tercihi kaydet
  localStorage.setItem('darkMode', isDarkMode);
  
  // İkonu güncelle
  if (isDarkMode) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Sayfa yüklendiğinde dark mode durumunu kontrol et
window.addEventListener('load', () => {
  // HackerText efekti kodları (mevcut kod)
  const elements = document.querySelectorAll('.hackerText');
  elements.forEach(element => new HackerText(element));
  
  // Dark mode kontrolü
  const darkModeToggle = document.getElementById('darkModeToggle');
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Toggle butonuna event listener ekle
  darkModeToggle.addEventListener('click', toggleDarkMode);
});

// Mevcut kodlarınızın sonuna bu fonksiyonları ekleyin
function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById('darkModeToggle');
  const isDarkMode = body.classList.toggle('dark-mode');
  
  // LocalStorage'a tercihi kaydet
  localStorage.setItem('darkMode', isDarkMode);
  
  // İkonu güncelle
  if (isDarkMode) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Sayfa yüklendiğinde dark mode durumunu kontrol et
window.addEventListener('load', () => {
  // HackerText efekti kodları (mevcut kod)
  const elements = document.querySelectorAll('.hackerText');
  elements.forEach(element => new HackerText(element));
  
  // Dark mode kontrolü
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle butonuna event listener ekle
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
});