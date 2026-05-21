// Ders verileri
const courses = [
    { name: "Türk Dili-II", link: "/IKU/dersler/Türk-Dili.html", icon: "fa-pen-nib" },
    { name: "Atatürk İlkeleri ve İnkılap Tarihi-II", link: "/IKU/dersler/Inkılap.html", icon: "fa-book" },
    { name: "Blok Zincir", link: "/IKU/dersler/Blok-Zincir.html", icon: "fa-cubes" },
    { name: "Yazılım Güvenliği", link: "/IKU/dersler/Yazılım-Güvenliği.html", icon: "fa-chalkboard-user" },
    { name: "Veri Tabanı Yönetim Sistemleri-II", link: "/IKU/dersler/Veri-Tabani.html", icon: "fa-database" },
    { name: "Kariyer Gelişimi", link: "/IKU/dersler/Kariyer-Gelişimi.html", icon: "fa-user-tie" },
    { name: "Öğrenim Yönetim Sistemleri", link: "/IKU/dersler/öys.html", icon: "fa-chalkboard-user" },
    { name: "İngilizce-II", link: "/IKU/dersler/Ingilizce.html", icon: "fa-language" },
    { name: "İş Sağlığı ve Güvenliği", link: "/IKU/dersler/iş-sağlıği.html", icon: "fa-helmet-safety" }
];

function searchCourses() {
    const input = document.getElementById('dersArama');
    const filter = input.value.toUpperCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    
    if (filter.length < 2) {
        resultsContainer.style.display = 'none';
        return;
    }

    const filteredCourses = courses.filter(course => 
        course.name.toUpperCase().includes(filter)
    );

    if (filteredCourses.length > 0) {
        filteredCourses.forEach(course => {
            const resultItem = document.createElement('a');
            resultItem.href = course.link;
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <i class="fas ${course.icon}"></i>
                ${course.name}
            `;
            resultsContainer.appendChild(resultItem);
        });
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = '<div class="search-result-item">Sonuç bulunamadı</div>';
        resultsContainer.style.display = 'block';
    }
}

// Dışarı tıklayınca kapat
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
        document.getElementById('searchResults').style.display = 'none';
    }
});