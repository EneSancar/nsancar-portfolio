function toggleSideMenu() {
    const sideMenu = document.getElementById('side-menu');
    const toggleBtn = document.querySelector('.side-toggle');
    
    // Menüyü aç/kapa
    sideMenu.classList.toggle('collapsed');
    toggleBtn.classList.toggle('collapsed');
    
    // İkonu değiştir
    const icon = toggleBtn.querySelector('i');
    if (sideMenu.classList.contains('collapsed')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
}

// Sayfa yüklendiğinde menüyü kontrol et
document.addEventListener('DOMContentLoaded', function() {
    const sideMenu = document.getElementById('side-menu');
    const toggleBtn = document.querySelector('.side-toggle');
    
    // Varsayılan olarak açık bırak (istediğiniz gibi)
    sideMenu.classList.remove('collapsed');
    toggleBtn.classList.remove('collapsed');
});