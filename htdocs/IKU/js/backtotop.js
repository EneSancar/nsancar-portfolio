document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Scroll event listener
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) { // 300px aşağı inince göster
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Tıklama eventi
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Yumuşak kaydırma
        });
    });
    
    // Alternatif olarak (daha eski tarayıcı desteği için)
    backToTopButton.addEventListener('click', function() {
        const scrollStep = -window.scrollY / 15;
        const scrollInterval = setInterval(function() {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    });
});