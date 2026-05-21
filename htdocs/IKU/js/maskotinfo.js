// HackerText sınıfı
class HackerText {
    constructor(element) {
        this.element = element;
        this.originalText = element.innerText;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update();
    }
    update() {
        let iterations = 0;
        const originalText = this.originalText;
        const duration = 0.1; // Her karakter değişimi arasındaki süre (ms), daha hızlı için 10ms yaptık

        const interval = setInterval(() => {
            this.element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join("");

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, duration);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Maskot ve yazıyı seç
    const maskot = document.getElementById("maskot");
    const welcomeText = document.getElementById("welcome-text");
    const infoButton = document.getElementById("info-button");

    // Maskotu görünür hale getir
    setTimeout(() => {
        maskot.style.opacity = "1";
        maskot.style.transform = "scale(1)"; // Normal boyutuna getir
        // Maskot tamamen göründükten sonra yazıyı görünür hale getir ve HackerText efekti başlat
        setTimeout(() => {
            welcomeText.classList.remove("hidden"); // Yazıyı görünür yap
            welcomeText.style.opacity = "1"; // Yazının opacity'sini artır
            new HackerText(welcomeText); // HackerText efekti uygula
        }, 550); // Maskot göründükten 1 saniye sonra yazı ortaya çıksın
    }, 300); // Maskot için başlangıç gecikmesi

    // Butonu görünür hale getir
    setTimeout(() => {
        infoButton.classList.remove("hidden"); // Butonu görünür yap
    }, 2000); // Yazı ortaya çıktıktan sonra buton görünür olacak

    // Butona tıklanınca yazıyı değiştir
    let textIndex = 0;
    const texts = ["Site içeriği çoğunlukla 'Bilgisayar Programcılığı' bölümünü ilgilendirmektedir!","Sarı kutu içerisinde belirtilen yazılar dersin final sınavı ile ilgili önemli bilgiler içerebilmektedir o yüzden bu yazıları görmezden gelmeyelim!","Bilişim Hukuku yer almamakta, Sancar adlı arkadaş tembel olduğu için derslere katılım sağlayamadı. Notu olan varsa bu arkadaşla paylaşabilirse çok sevinir.(paylaşacağınız not buraya eklenmeyecektir emeğe saygıdan ötürü)","Sayfa güncelleştirildi geliştirildi. Sağ alt köşeden dark mode'a geçerek gözlerinizi dinlendirebilirsiniz","Site hoşunuza gittiyse bir beğeninizi alırım 👉👈","Site yapımında kullandığım tüm uygulama ve kaynaklara üstteki menü üzerinden ulaşabilirsiniz", "Ders Notları, Örnek çalışma soruları ve diğer kaynaklar teams üzerinden alınmıştır", "Özetler için ChatGPT-o3/ChatGPT-4o modeli kullanılmıştır.","Bu site, bölüm öğrencilerinin ders notlarına ve kaynaklarına hızlıca ulaşmasını sağlamak için tasarlanmıştır."]; // Farklı yazılar
    let shownTexts = []; // Gösterilen yazıların indekslerini tutan dizi
    infoButton.addEventListener("click", () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * texts.length); // Rastgele bir index seç
        } while (shownTexts.includes(randomIndex)); // Eğer bu index daha önce gösterilmişse, tekrar seç
        welcomeText.textContent = texts[randomIndex]; // Yazıyı rastgele seçilen index'e göre değiştir
        shownTexts.push(randomIndex); // Gösterilen yazıların indekslerini kaydet
        if (shownTexts.length === texts.length) {
            shownTexts = []; // Tüm yazılar gösterildikten sonra, gösterilen yazıların indekslerini sıfırla
        }
        new HackerText(welcomeText); // Yeni yazı için HackerText efekti uygula
    });
});
