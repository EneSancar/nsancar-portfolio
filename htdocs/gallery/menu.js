unction on() {
  document.getElementById("overlay").style.display = "block";
   document.getElementById("main").style.height = "100" + "vh" ;
   }

function off() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("main").style.height = "140" + "vh" ;
}

function AlertWeb(){
	 alert("Sayfa Yapım Aşamasındadır!");
}
function AlertCv(){
  alert("Lock")
}
function TimeAndSpace(){
  alert("hayat çok kısa ve zaman bu kısacık ömrümüzde bile hızla akıp geçmeye devam ediyor o yüzden kişi elinden geldiğince kendisi için en iyisini yapmalı. Hayatını dilediği bir şekilde yaşamalı yaşayabilmeli çünkü aksi takdirde mutlak ölüm kendisini bilinmedik bir zamanda yakaladığında pişmanlığın getirdiği hüzün saracaktır ölü bedenini. ")
}






// Örnek: Sayfayı en üstüne kaydırmak için JavaScript kullanımı
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Düğmeye tıklandığında sayfayı en üstüne kaydır
document.getElementById('scrollTopButton').addEventListener('click', scrollToTop);



function myFunctionNumber() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 7000);
}


