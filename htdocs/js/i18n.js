/**
 * nsancar.com — i18n Çoklu Dil Sistemi (TR / EN)
 * Dinamik istemci taraflı anlık dil çevirisi ve localStorage kalıcılığı.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "ns-lang";
  const DEFAULT_LANG = "tr";

  const TRANSLATIONS = {
    tr: {
      // Navigasyon & Genel
      "nav.home": "Ana Sayfa",
      "nav.about": "Hakkımda",
      "nav.projects": "Projeler",
      "nav.services": "Hizmetler",
      "nav.blog": "Blog",
      "nav.activities": "Aktiviteler",
      "nav.didim": "Didim",
      "nav.contact": "İletişim",
      "nav.menu": "Menü",
      "nav.theme_toggle": "Tema Değiştir",
      "nav.lang_toggle": "Dili Değiştir (TR / EN)",

      // Mega Menü
      "mega.web_title": "Web Tasarım",
      "mega.web_desc": "Profesyonel, mobil uyumlu ve dinamik web siteleri.",
      "mega.hosting_title": "Hosting & Domain",
      "mega.hosting_desc": "Güvenilir sunucu ve alan adı çözümleri, teknik destek.",
      "mega.graphic_title": "Grafik Tasarım",
      "mega.graphic_desc": "Logo, kurumsal kimlik ve marka bilinirliği tasarımları.",
      "mega.video_title": "Video Düzenleme",
      "mega.video_desc": "Kurumsal video, animasyon ve kurgu prodüksiyonu.",
      "mega.social_title": "Sosyal Medya Yönetimi",
      "mega.social_desc": "Instagram, Facebook içerik üretimi ve marka yönetimi.",

      // Hero Bölümü
      "hero.eyebrow": "Front-End Developer",
      "hero.title": "Modern <span class=\"gradient\">Web Tasarım</span> & Geliştirme",
      "hero.desc": "İşletmeniz için dikkat çekici, hızlı ve mobil uyumlu web siteleri tasarlıyorum. Markanızı dijital dünyada güçlü bir şekilde temsil edelim.",
      "hero.cta_quote": "Ücretsiz Teklif Al",
      "hero.cta_services": "Servisler",
      "hero.cta_about": "Hakkımda",

      // Ana Sayfa Servisler Vitrini
      "home.services_label": "Neler Yapıyorum?",
      "home.services_title": "Hizmetlerim",
      "home.services_sub": "İşletmenizi dijital dünyada öne çıkaracak profesyonel çözümler sunuyorum.",
      "home.svc_web_title": "Web Tasarım",
      "home.svc_web_desc": "Modern, mobil uyumlu ve SEO dostu web siteleri tasarlayarak markanızı dijital dünyada güçlü bir şekilde temsil ediyorum.",
      "home.svc_hosting_title": "Hosting & Domain",
      "home.svc_hosting_desc": "Güvenilir sunucu altyapısı, alan adı kaydı ve teknik destek ile sitenizin her zaman erişilebilir kalmasını sağlıyorum.",
      "home.svc_graphic_title": "Grafik Tasarım",
      "home.svc_graphic_desc": "Logo, kartvizit ve kurumsal kimlik tasarımlarıyla markanızın görsel dilini oluşturuyorum.",
      "home.svc_video_title": "Video Düzenleme",
      "home.svc_video_desc": "Kurumsal tanıtım videoları, animasyonlar ve profesyonel kurgu ile hikayenizi görsel olarak aktarıyorum.",
      "home.svc_social_title": "Sosyal Medya Yönetimi",
      "home.svc_social_desc": "Instagram ve Facebook başta olmak üzere sosyal medya hesaplarınızın içerik üretimi ve marka yönetimini üstleniyorum.",

      // İŞLETMENİZE NE KAZANDIRIRIM (Benefit Section)
      "benefit.label": "Neden Web Sitesi?",
      "benefit.title_prefix": "İşletmenize ",
      "benefit.title_highlight": "Ne Kazandırırım?",
      "benefit.subtitle": "Teknik bilgi sizin derdiniz olmasın. Ben kodla ilgileneyim, siz müşterilerinizle.",
      "benefit.hero_title": "Dijitalde Görünürlük,<br>Gerçek Hayatta Müşteri",
      "benefit.hero_desc": "İnternette ürün veya hizmet arayan potansiyel müşterileriniz sizi Google'da bulamıyorsa, doğrudan rakiplerinize gidiyorlar. Profesyonel bir web sitesi, işletmenizi 7/24 tanıtan dijital vitrin demektir.",
      "benefit.stat_search": "Online arama ile başlar",
      "benefit.stat_trust": "Web sitesine göre güvenilirlik",
      "benefit.stat_247": "Kesintisiz tanıtım",
      "benefit.speed_title": "Hız & İlk İzlenim",
      "benefit.speed_desc": "3 saniyeden uzun yüklenen bir site, ziyaretçilerin %53'ünü kaybeder. Siteniz şimşek hızında açılır.",
      "benefit.mobile_title": "Mobil Müşteri Kaçırmayın",
      "benefit.mobile_desc": "Turistlerin %80'i telefon kullanır. Siteniz her ekranda kusursuz çalışır, bir tıkla arama veya yol tarifi alırlar.",
      "benefit.trust_title": "Güven & Profesyonellik",
      "benefit.trust_desc": "Kurumsal bir web sitesi olan işletme, müşterinin gözünde anında güvenilir hale gelir. Rakiplerinizden bir adım önde olun.",
      "benefit.seo_title": "Google'da Üst Sıralarda",
      "benefit.seo_desc": "SEO altyapısıyla sektörel aramalarda üst sıralarda çıkarak doğrudan organik müşteri kazanın.",
      "benefit.cta_text": "İşletmeniz henüz dijitalde değilse, <strong>her gün müşteri kaybediyorsunuz.</strong>",
      "benefit.cta_btn": "Ücretsiz Teklif Al",

      // Hakkımda Önizleme
      "about_preview.label": "Tanışalım",
      "about_preview.title": "Hakkımda",
      "about_preview.text": "Merhaba, ben Enes. Didim, Aydın'da yaşıyorum ve alanım web tasarım & Front-End geliştirme.",

      // Yetenekler & Hızlı Erişim
      "home.skills_title": "My Skills",
      "home.exp_title": "All Experience",
      "home.quick_label": "Keşfet",
      "home.quick_title": "Hızlı Erişim",
      "home.quick_projects": "Projeler",
      "home.quick_projects_sub": "Portfolyom",
      "home.quick_services": "Services",
      "home.quick_services_sub": "Hizmetlerim",
      "home.quick_activities": "Aktiviteler",
      "home.quick_activities_sub": "Favorilerim",

      // Yorumlar & İletişim
      "home.reviews_label": "Google Değerlendirmeleri",
      "home.reviews_title": "Müşterilerim Ne Diyor?",
      "home.reviews_hint": "Kaydırarak tüm yorumları görebilirsiniz",
      "home.review_badge": "Google Yorumu",

      // Profil & Mesaj
      "contact.profile_label": "Bağlantı",
      "contact.profile_title": "İletişim & Profiller",
      "contact.form_label": "Bağlantı",
      "contact.form_title": "Mesaj Gönder",
      "contact.form_name_ph": "Adın",
      "contact.form_email_ph": "E-posta adresin",
      "contact.form_subject_ph": "Konu",
      "contact.form_message_ph": "Mesajın",
      "contact.form_submit": "Gönder",
      "contact.form_sending": "Gönderiliyor...",
      "contact.form_success": "Mesajınız başarıyla iletildi!",
      "contact.form_error": "Mesaj gönderilemedi. Lütfen tekrar deneyin.",

      // Footer
      "footer.tagline": "Web Tasarım & Dijital Çözümler",
      "footer.copy": "Copyright &copy; 2026 — Designed by",

      // Hakkımda Sayfası
      "about.bio_title": "Hakkımda",
      "about.edu_title": "Eğitim",
      "about.exp_title": "Deneyim",
      "about.skills_title": "Yetenekler",
      "about.interests_title": "İlgi Alanları",

      // Projeler Sayfası
      "projects.hero_label": "Portfolyo",
      "projects.hero_title": "Projelerim",
      "projects.hero_desc": "Tamamlanan web tasarım, yazılım ve tasarım çalışmaları.",
      "projects.filter_all": "Tümü",
      "projects.btn_detail": "Detaylar",
      "projects.btn_demo": "Canlı Demo",
      "projects.btn_code": "Kaynak Kod",
      "projects.modal_close": "Kapat",

      // Servisler Sayfası
      "services.hero_label": "Hizmetler",
      "services.hero_title": "Dijital Çözümler",
      "services.hero_desc": "Web tasarım, hosting, grafik tasarım ve dijital pazarlama alanında profesyonel çözümler.",

      // Aktiviteler Sayfası
      "activities.hero_label": "Hobi & Favoriler",
      "activities.hero_title": "Aktiviteler",
      "activities.hero_desc": "Severek izlediğim diziler, takip ettiğim kanallar ve okuma listem.",
      "activities.filter_all": "Tümü",
      "activities.filter_watching": "İzliyorum",
      "activities.filter_completed": "Bitirdim",
      "activities.filter_plan": "Listemde",

      // Blog Sayfası
      "blog.hero_label": "Güncel Yazılar",
      "blog.hero_title": "Blog",
      "blog.hero_desc": "Web tasarım, SEO, teknoloji ve güncel trendler üzerine rehberler.",
      "blog.search_ph": "Yazılarda ara...",
      "blog.read_more": "Devamını Oku"
    },

    en: {
      // Navigation & General
      "nav.home": "Home",
      "nav.about": "About",
      "nav.projects": "Projects",
      "nav.services": "Services",
      "nav.blog": "Blog",
      "nav.activities": "Activities",
      "nav.didim": "Didim",
      "nav.contact": "Contact",
      "nav.menu": "Menu",
      "nav.theme_toggle": "Toggle Theme",
      "nav.lang_toggle": "Switch Language (TR / EN)",

      // Mega Menu
      "mega.web_title": "Web Design",
      "mega.web_desc": "Professional, mobile-responsive and dynamic websites.",
      "mega.hosting_title": "Hosting & Domain",
      "mega.hosting_desc": "Reliable hosting infrastructure, domain registration & support.",
      "mega.graphic_title": "Graphic Design",
      "mega.graphic_desc": "Logo, corporate identity and brand visual designs.",
      "mega.video_title": "Video Editing",
      "mega.video_desc": "Corporate promo videos, animations and creative post-production.",
      "mega.social_title": "Social Media",
      "mega.social_desc": "Content creation and brand growth on Instagram & Facebook.",

      // Hero Section
      "hero.eyebrow": "Front-End Developer",
      "hero.title": "Modern <span class=\"gradient\">Web Design</span> & Development",
      "hero.desc": "I design high-performance, mobile-responsive, and engaging websites tailored for your business. Let's make your brand shine digitally.",
      "hero.cta_quote": "Get a Free Quote",
      "hero.cta_services": "Services",
      "hero.cta_about": "About Me",

      // Home Services Showcase
      "home.services_label": "What I Do",
      "home.services_title": "My Services",
      "home.services_sub": "Offering professional solutions to make your business stand out in the digital world.",
      "home.svc_web_title": "Web Design",
      "home.svc_web_desc": "Designing modern, mobile-friendly and SEO-optimized websites that elevate your digital brand presence.",
      "home.svc_hosting_title": "Hosting & Domain",
      "home.svc_hosting_desc": "Ensuring maximum uptime with high-performance server infrastructure, domain management and tech support.",
      "home.svc_graphic_title": "Graphic Design",
      "home.svc_graphic_desc": "Building cohesive visual languages with bespoke logos, business cards and brand designs.",
      "home.svc_video_title": "Video Editing",
      "home.svc_video_desc": "Telling your brand's story through engaging corporate promos, motion graphics and crisp post-production.",
      "home.svc_social_title": "Social Media Management",
      "home.svc_social_desc": "Driving engagement with targeted social media campaigns, high-impact visuals and community management.",

      // Benefit Section
      "benefit.label": "Why a Website?",
      "benefit.title_prefix": "What Value Do I Bring ",
      "benefit.title_highlight": "To Your Business?",
      "benefit.subtitle": "Don't stress over technical details. I handle the code so you can focus on your clients.",
      "benefit.hero_title": "Visibility Online,<br>Customers in Real Life",
      "benefit.hero_desc": "When potential clients search for services online and can't find you on Google, they go straight to competitors. A professional website is your 24/7 digital storefront.",
      "benefit.stat_search": "Starts with online search",
      "benefit.stat_trust": "Judge credibility by website",
      "benefit.stat_247": "Non-stop promotion",
      "benefit.speed_title": "Speed & First Impression",
      "benefit.speed_desc": "Sites loading longer than 3 seconds lose 53% of visitors. Your site will load with lightning speed.",
      "benefit.mobile_title": "Never Miss Mobile Visitors",
      "benefit.mobile_desc": "Over 80% of tourists and users browse on phones. Your site runs flawlessly on all devices with one-tap directions.",
      "benefit.trust_title": "Trust & Professionalism",
      "benefit.trust_desc": "Businesses with a corporate website build immediate credibility. Stay one step ahead of your competition.",
      "benefit.seo_title": "Rank Higher on Google",
      "benefit.seo_desc": "Targeted SEO infrastructure makes sure customers searching in your industry find you organically.",
      "benefit.cta_text": "If your business isn't online yet, <strong>you are losing clients every single day.</strong>",
      "benefit.cta_btn": "Get a Free Quote",

      // About Preview
      "about_preview.label": "Nice to meet you",
      "about_preview.title": "About Me",
      "about_preview.text": "Hi, I'm Enes. Based in Didim, Aydın, specializing in web design and Front-End development.",

      // Skills & Quick Access
      "home.skills_title": "My Skills",
      "home.exp_title": "All Experience",
      "home.quick_label": "Discover",
      "home.quick_title": "Quick Access",
      "home.quick_projects": "Projects",
      "home.quick_projects_sub": "My Portfolio",
      "home.quick_services": "Services",
      "home.quick_services_sub": "My Services",
      "home.quick_activities": "Activities",
      "home.quick_activities_sub": "My Favorites",

      // Reviews & Contact
      "home.reviews_label": "Google Reviews",
      "home.reviews_title": "What Clients Say",
      "home.reviews_hint": "Swipe or scroll to see all reviews",
      "home.review_badge": "Google Review",

      // Contact Form & Profiles
      "contact.profile_label": "Connect",
      "contact.profile_title": "Contact & Profiles",
      "contact.form_label": "Connect",
      "contact.form_title": "Send a Message",
      "contact.form_name_ph": "Your Name",
      "contact.form_email_ph": "Your Email Address",
      "contact.form_subject_ph": "Subject",
      "contact.form_message_ph": "Your Message",
      "contact.form_submit": "Send Message",
      "contact.form_sending": "Sending...",
      "contact.form_success": "Your message has been sent successfully!",
      "contact.form_error": "Failed to send message. Please try again.",

      // Footer
      "footer.tagline": "Web Design & Digital Solutions",
      "footer.copy": "Copyright &copy; 2026 — Designed by",

      // About Page
      "about.bio_title": "About Me",
      "about.edu_title": "Education",
      "about.exp_title": "Experience",
      "about.skills_title": "Skills",
      "about.interests_title": "Interests",

      // Projects Page
      "projects.hero_label": "Portfolio",
      "projects.hero_title": "My Projects",
      "projects.hero_desc": "Completed web design, software, and creative development works.",
      "projects.filter_all": "All",
      "projects.btn_detail": "Details",
      "projects.btn_demo": "Live Demo",
      "projects.btn_code": "Source Code",
      "projects.modal_close": "Close",

      // Services Page
      "services.hero_label": "Services",
      "services.hero_title": "Digital Solutions",
      "services.hero_desc": "Professional solutions in web design, hosting, branding, and digital media.",

      // Activities Page
      "activities.hero_label": "Hobbies & Favorites",
      "activities.hero_title": "Activities",
      "activities.hero_desc": "Series I enjoy watching, favorite YouTube channels, and reading lists.",
      "activities.filter_all": "All",
      "activities.filter_watching": "Watching",
      "activities.filter_completed": "Completed",
      "activities.filter_plan": "Plan to Watch",

      // Blog Page
      "blog.hero_label": "Recent Articles",
      "blog.hero_title": "Blog",
      "blog.hero_desc": "Guides and insights on web design, SEO, and technological trends.",
      "blog.search_ph": "Search articles...",
      "blog.read_more": "Read More"
    }
  };

  /**
   * Mevcut dili getir (varsayılan: tr)
   */
  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  /**
   * Çeviri metni getir
   */
  function t(key, fallback) {
    const lang = getCurrentLang();
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key]) {
      return TRANSLATIONS[DEFAULT_LANG][key];
    }
    return fallback || key;
  }

  /**
   * Sayfadaki tüm çevrilebilir elemanları güncelle
   */
  function applyTranslations(lang) {
    lang = lang || getCurrentLang();
    document.documentElement.lang = lang;

    // 1. data-i18n niteliğine sahip elemanlar
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (val !== undefined) {
        if (val.includes("<") && val.includes(">")) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // 2. data-i18n-html niteliğine sahip elemanlar
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (val !== undefined) {
        el.innerHTML = val;
      }
    });

    // 3. Placeholder çevirileri
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (val !== undefined) {
        el.placeholder = val;
      }
    });

    // 4. Title & aria-label çevirileri
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const val = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (val !== undefined) {
        el.title = val;
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (val !== undefined) {
        el.setAttribute("aria-label", val);
      }
    });

    // 5. Standart sayfa bileşenlerini akıllı otomatik çeviri (data-i18n olmadan da anında çalışması için)
    autoTranslateCommon(lang);

    // 6. Dil butonunun durumunu güncelle
    updateLangButtons(lang);

    // 7. Typed.js varsa yenile
    updateTypedWords(lang);

    // 8. Özel olay fırlat
    window.dispatchEvent(new CustomEvent("ns-language-change", { detail: { lang } }));
  }

  /**
   * Standart sayfa bileşenlerini (nav, footer, butonlar) otomatik çevir
   */
  function autoTranslateCommon(lang) {
    const isEn = lang === "en";

    // Navigasyon linkleri
    const navItems = [
      { sel: '.nav-links a[href="/"], .footer-nav a[href="/"]', tr: "Ana Sayfa", en: "Home" },
      { sel: '.nav-links a[href="/hakkimda"], .footer-nav a[href="/hakkimda"]', tr: "Hakkımda", en: "About" },
      { sel: '.nav-links a[href="/projeler"], .footer-nav a[href="/projeler"]', tr: "Projeler", en: "Projects" },
      { sel: '.mega-menu-trigger', tr: 'Hizmetler <i class="fa-solid fa-chevron-down"></i>', en: 'Services <i class="fa-solid fa-chevron-down"></i>', isHtml: true },
      { sel: '.footer-nav a[href="/servisler"]', tr: "Hizmetler", en: "Services" },
      { sel: '.nav-links a[href="/blog"], .footer-nav a[href="/blog"]', tr: "Blog", en: "Blog" },
      { sel: '.nav-links a[href="/didim-web-tasarim"]', tr: "Didim", en: "Didim" },
      { sel: '.footer-nav a[href="/aktiviteler"]', tr: "Aktiviteler", en: "Activities" },
      { sel: '.nav-links a[href="/aktiviteler"]', attr: "title", tr: "Aktiviteler", en: "Activities" }
    ];

    navItems.forEach((item) => {
      document.querySelectorAll(item.sel).forEach((el) => {
        if (item.attr) {
          el.setAttribute(item.attr, isEn ? item.en : item.tr);
        } else if (item.isHtml) {
          el.innerHTML = isEn ? item.en : item.tr;
        } else {
          el.textContent = isEn ? item.en : item.tr;
        }
      });
    });

    // Mega Menü Kartları
    const megaCards = [
      { sel: '.mega-card[href*="web-tasarim"] h4', tr: "Web Tasarım", en: "Web Design" },
      { sel: '.mega-card[href*="web-tasarim"] p', tr: "Profesyonel, mobil uyumlu ve dinamik web siteleri.", en: "Professional, mobile-responsive and dynamic websites." },
      { sel: '.mega-card[href*="hosting-domain"] h4', tr: "Hosting & Domain", en: "Hosting & Domain" },
      { sel: '.mega-card[href*="hosting-domain"] p', tr: "Güvenilir sunucu ve alan adı çözümleri, teknik destek.", en: "Reliable hosting infrastructure, domain registration & support." },
      { sel: '.mega-card[href*="grafik-tasarim"] h4', tr: "Grafik Tasarım", en: "Graphic Design" },
      { sel: '.mega-card[href*="grafik-tasarim"] p', tr: "Logo, kurumsal kimlik ve marka bilinirliği tasarımları.", en: "Logo, corporate identity and brand visual designs." },
      { sel: '.mega-card[href*="video-duzenleme"] h4', tr: "Video Düzenleme", en: "Video Editing" },
      { sel: '.mega-card[href*="video-duzenleme"] p', tr: "Kurumsal video, animasyon ve kurgu prodüksiyonu.", en: "Corporate promo videos, animations and creative editing." },
      { sel: '.mega-card[href*="sosyal-medya"] h4', tr: "Sosyal Medya Yönetimi", en: "Social Media" },
      { sel: '.mega-card[href*="sosyal-medya"] p', tr: "Instagram, Facebook içerik üretimi ve marka yönetimi.", en: "Content creation and brand growth on Instagram & Facebook." }
    ];

    megaCards.forEach((c) => {
      document.querySelectorAll(c.sel).forEach((el) => {
        el.textContent = isEn ? c.en : c.tr;
      });
    });

    // Hero Section butonları ve başlığı (index.html)
    const heroBtn1 = document.querySelector('.hero-actions .btn-animated .btn-animated__text');
    if (heroBtn1) heroBtn1.textContent = isEn ? "Get a Free Quote" : "Ücretsiz Teklif Al";

    const heroGhostServis = document.querySelector('.hero-actions a[href="/servisler"].btn-ghost');
    if (heroGhostServis) heroGhostServis.textContent = isEn ? "Services" : "Servisler";

    const heroGhostAbout = document.querySelector('.hero-actions a[href="/hakkimda"].btn-ghost');
    if (heroGhostAbout) heroGhostAbout.textContent = isEn ? "About" : "Hakkımda";

    // İletişim formu butonları ve yer tutucuları
    const nameInput = document.getElementById("cf-name");
    if (nameInput) nameInput.placeholder = isEn ? "Your Name" : "Adın";

    const emailInput = document.getElementById("cf-email");
    if (emailInput) emailInput.placeholder = isEn ? "Your Email" : "E-posta adresin";

    const subjectInput = document.getElementById("cf-subject");
    if (subjectInput) subjectInput.placeholder = isEn ? "Subject" : "Konu";

    const msgInput = document.getElementById("cf-message");
    if (msgInput) msgInput.placeholder = isEn ? "Your Message" : "Mesajın";

    const cfBtn = document.querySelector(".contact-form-btn");
    if (cfBtn && !cfBtn.disabled) cfBtn.textContent = isEn ? "Send" : "Gönder";

    // Footer copyright
    const footerCopy = document.querySelector(".footer-copy");
    if (footerCopy) {
      footerCopy.innerHTML = isEn
        ? 'Copyright &copy; 2026 — Designed by <span class="designer">Enes Sancar</span>'
        : 'Copyright &copy; 2026 — Designed by <span class="designer">Enes Sancar</span>';
    }
  }

  /**
   * Typed.js kelimelerini dile göre güncelle
   */
  function updateTypedWords(lang) {
    const typedEl = document.querySelector(".auto-type");
    if (!typedEl) return;

    if (window._nsTypedInstance && typeof window._nsTypedInstance.destroy === "function") {
      try {
        window._nsTypedInstance.destroy();
      } catch (e) {}
    }

    if (typeof Typed === "undefined") return;

    const strings = lang === "en"
      ? ["Coding", "Travelling", "Discovering"]
      : ["Kodlama", "Gezme", "Keşfetme"];

    try {
      window._nsTypedInstance = new Typed(".auto-type", {
        strings: strings,
        typeSpeed: 80,
        backSpeed: 60,
        loop: true
      });
    } catch (e) {}
  }

  /**
   * Dil butonlarının rozetini ve etiketini güncelle
   */
  function updateLangButtons(lang) {
    document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
      const codeSpan = btn.querySelector(".lang-code");
      const targetLang = lang === "tr" ? "EN" : "TR";
      const ariaLabel = lang === "tr" ? "Switch to English" : "Türkçe'ye geç";
      btn.setAttribute("aria-label", ariaLabel);
      btn.setAttribute("title", ariaLabel);
      if (codeSpan) {
        codeSpan.textContent = targetLang;
      } else {
        btn.innerHTML = `<i class="fa-solid fa-globe"></i><span class="lang-code">${targetLang}</span>`;
      }
    });
  }

  /**
   * Dili değiştir
   */
  function toggleLanguage() {
    const current = getCurrentLang();
    const next = current === "tr" ? "en" : "tr";
    localStorage.setItem(STORAGE_KEY, next);
    applyTranslations(next);
  }

  /**
   * Header'daki nav-controls içerisine dil butonunu ekle
   */
  function setupLangButton() {
    document.querySelectorAll(".nav-controls").forEach((navControls) => {
      if (navControls.querySelector(".lang-toggle-btn")) return;

      const btn = document.createElement("button");
      btn.id = "langToggle";
      btn.type = "button";
      btn.className = "nav-toggle-btn lang-toggle-btn";
      const cur = getCurrentLang();
      const target = cur === "tr" ? "EN" : "TR";
      btn.setAttribute("aria-label", cur === "tr" ? "Switch to English" : "Türkçe'ye geç");
      btn.setAttribute("title", cur === "tr" ? "Switch to English" : "Türkçe'ye geç");
      btn.innerHTML = `<i class="fa-solid fa-globe"></i><span class="lang-code">${target}</span>`;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleLanguage();
      });

      // Tema butonunun hemen yanına ekle
      navControls.appendChild(btn);
    });

    // Sayfada önceden eklenmiş buton varsa dinleyici bağla
    document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
      btn.onclick = function (e) {
        e.preventDefault();
        toggleLanguage();
      };
    });
  }

  /**
   * Başlatıcı
   */
  function init() {
    setupLangButton();
    const lang = getCurrentLang();
    applyTranslations(lang);
  }

  // DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Global API
  window.i18n = {
    t,
    getLang: getCurrentLang,
    setLang: function (l) {
      if (l === "tr" || l === "en") {
        localStorage.setItem(STORAGE_KEY, l);
        applyTranslations(l);
      }
    },
    toggle: toggleLanguage,
    apply: applyTranslations,
    data: TRANSLATIONS
  };
})();
