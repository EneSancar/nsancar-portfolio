function showAnswer(answerId) {
    const answer = document.getElementById(answerId);
    answer.classList.add('show');
  }


  function checkAnswer(questionNumber, correctAnswer, element) {
    const selected = element;
    const label = selected.parentElement;
    const allLabels = label.parentElement.getElementsByTagName('label');
    
    // Önce tüm ikonları gizle
    for(let lab of allLabels) {
        lab.querySelector('.check-icon').style.display = 'none';
        lab.querySelector('.times-icon').style.display = 'none';
    }
    
    if (selected.value === correctAnswer) {
        // Doğru cevap için yeşil tik
        label.querySelector('.check-icon').style.display = 'inline-block';
    } else {
        // Yanlış cevap için kırmızı çarpı
        label.querySelector('.times-icon').style.display = 'inline-block';
        // Doğru cevabı göster
        const correctLabel = label.parentElement.querySelector(`input[value="${correctAnswer}"]`).parentElement;
        correctLabel.querySelector('.check-icon').style.display = 'inline-block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var acc = document.getElementsByClassName("accordion-btn");
    
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.padding = "0 18px";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "18px";
            }
        });
    }
});