/* ============================================================
   AKDENİZ OTO BAKIM & LASTİK — script.js
   Saf JavaScript. Bootstrap'in kendi JS'i (collapse) dışında
   hiçbir kütüphaneye bağımlı değil, derleme adımı yok.

   İÇİNDEKİLER
     01. Navbar: kaydırınca koyulaşma
     02. Mobil menü: linke basınca kapanma
     03. Aktif menü işaretleme (scroll spy)
     04. Çalışma saatleri: bugünü vurgula + "şu an açık mı"
     05. Yukarı çık butonu
     06. Yıl bilgisi (footer)
   ============================================================ */
(function () {
  'use strict';

  /* Sayfa bileşenleri hazır olmadan çalışmasın */
  document.addEventListener('DOMContentLoaded', function () {

    /* ========================================================
       01. NAVBAR — kaydırınca koyulaşma
       Hero koyu olduğu için başta şeffaflığa yakın, aşağı
       inildiğinde gölge + tam opaklık kazanıyor.
       ======================================================== */
    var navbar = document.getElementById('mainNavbar');

    function navbarDurumu() {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    navbarDurumu();

    /* ========================================================
       02. MOBİL MENÜ — linke basınca kendiliğinden kapansın
       Bootstrap açmayı hallediyor ama kapatmayı etmiyor;
       kapanmazsa menü içeriğin üstünde kalıyor.
       ======================================================== */
    var menuKutusu = document.getElementById('navbarContent');

    document.querySelectorAll('#navbarContent .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (!menuKutusu || !menuKutusu.classList.contains('show')) return;
        /* Bootstrap yüklüyse onun API'siyle, değilse elle kapat */
        if (window.bootstrap && window.bootstrap.Collapse) {
          window.bootstrap.Collapse.getOrCreateInstance(menuKutusu).hide();
        } else {
          menuKutusu.classList.remove('show');
        }
      });
    });

    /* ========================================================
       03. AKTİF MENÜ İŞARETLEME
       Ekranın üst üçte birine giren bölümün menü linki
       vurgulanır. IntersectionObserver, scroll dinlemekten
       hem daha ucuz hem daha kararlı.
       ======================================================== */
    var menuLinkleri = Array.prototype.slice.call(
      document.querySelectorAll('#navbarContent .nav-link[href^="#"]')
    );
    var bolumler = menuLinkleri
      .map(function (l) { return document.querySelector(l.getAttribute('href')); })
      .filter(Boolean);

    if ('IntersectionObserver' in window && bolumler.length) {
      var gozlemci = new IntersectionObserver(function (girisler) {
        girisler.forEach(function (giris) {
          if (!giris.isIntersecting) return;
          var id = giris.target.id;
          menuLinkleri.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        });
      }, { rootMargin: '-64px 0px -66% 0px', threshold: 0 });

      bolumler.forEach(function (b) { gozlemci.observe(b); });
    }

    /* ========================================================
       04. ÇALIŞMA SAATLERİ
       a) Bugünün satırına "today" sınıfı — müşteri kendi gününü
          tabloda aramak zorunda kalmıyor.
       b) Listenin altına canlı "şu an açık / kapalı" rozeti.

       Saatler burada tek yerde tanımlı; işletmenin saati
       değişirse HTML ile BURASI birlikte güncellenmeli.
       ======================================================== */
    var saatListesi = document.querySelector('.hours-list');

    if (saatListesi) {
      var simdi = new Date();

      /* getDay(): 0 = Pazar. HTML'de data-day 1..7, 7 = Pazar. */
      var bugun = simdi.getDay() === 0 ? 7 : simdi.getDay();

      var bugunSatiri = saatListesi.querySelector('[data-day="' + bugun + '"]');
      if (bugunSatiri) bugunSatiri.classList.add('today');

      /* Gün numarasına göre açılış–kapanış, dakika cinsinden */
      var takvim = {
        1: [510, 1110], 2: [510, 1110], 3: [510, 1110],   /* 08:30 – 18:30 */
        4: [510, 1110], 5: [510, 1110],
        6: [540, 960],                                     /* 09:00 – 16:00 */
        7: null                                            /* Pazar kapalı  */
      };

      var suAnDakika = simdi.getHours() * 60 + simdi.getMinutes();
      var bugunSaat = takvim[bugun];
      var acikMi = !!bugunSaat && suAnDakika >= bugunSaat[0] && suAnDakika < bugunSaat[1];

      var rozet = document.createElement('p');
      rozet.className = 'hours-status ' + (acikMi ? 'is-open' : 'is-closed');
      rozet.innerHTML = acikMi
        ? '<i class="bi bi-check-circle-fill"></i> Şu an açığız — doğrudan gelebilirsiniz.'
        : '<i class="bi bi-clock-fill"></i> Şu an kapalıyız — mesaj bırakın, açılışta dönelim.';
      saatListesi.insertAdjacentElement('afterend', rozet);
    }

    /* ========================================================
       05. YUKARI ÇIK BUTONU
       ======================================================== */
    var yukariBtn = document.getElementById('scrollTop');

    function yukariBtnDurumu() {
      if (!yukariBtn) return;
      yukariBtn.classList.toggle('show', window.scrollY > 500);
    }
    yukariBtnDurumu();

    if (yukariBtn) {
      yukariBtn.addEventListener('click', function () {
        /* Hareket azaltma tercihi açıksa anında zıpla */
        var azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: azalt ? 'auto' : 'smooth' });
      });
    }

    /* ========================================================
       SCROLL DİNLEYİCİSİ — tek yerden, throttle'lı
       Her piksel için değil, tarayıcı çizim karesi başına
       bir kez çalışır.
       ======================================================== */
    var beklemede = false;
    window.addEventListener('scroll', function () {
      if (beklemede) return;
      beklemede = true;
      window.requestAnimationFrame(function () {
        navbarDurumu();
        yukariBtnDurumu();
        beklemede = false;
      });
    }, { passive: true });

    /* ========================================================
       06. FOOTER YILI
       Yıl başında "2025" yazan siteye düşmemek için.
       ======================================================== */
    var yilAlani = document.getElementById('yil');
    if (yilAlani) yilAlani.textContent = new Date().getFullYear();

  });
})();
