function showAnswer(answerId) {
      const answer = document.getElementById(answerId);
      answer.classList.add('show');
    }

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
            const duration = 9; // Her karakter değişimi arasındaki süre (ms)
    
            const interval = setInterval(() => {
                this.element.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iterations) {
                            return originalText[index];
                        }
                        return this.chars[Math.floor(Math.random() * this.chars.length)];
                    })
                    .join("");
    
                if(iterations >= originalText.length) {
                    clearInterval(interval);
                }
    
                iterations += 1/3;
            }, duration);
        }
    }

    // Sayfa yüklendiğinde efekti başlat
    window.addEventListener('load', () => {
        const elements = document.querySelectorAll('.hackerText');
        elements.forEach(element => new HackerText(element));
    });