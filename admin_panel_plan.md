# nsancar.com — Admin Panel İmplementasyon Planı

## Genel Strateji

### Neden GitHub API yaklaşımı?

Mevcut altyapı: **Pure HTML/CSS/JS → GitHub → Vercel (otomatik deploy)**

Bu zincir bozulmadan, admin paneli bu zincirin üzerine oturur:

```
Admin Panel → GitHub REST API → Repo'daki JSON dosyası güncellenir
                                         ↓
                              Vercel değişikliği algılar
                                         ↓
                              Otomatik deploy (~30 saniye)
                                         ↓
                              nsancar.com güncellenir
```

**Avantajları:**
- Sıfır ek hosting/veritabanı maliyeti
- Mevcut Vercel + GitHub pipeline aynen kalır
- Her değişiklik otomatik commit → versiyon geçmişi
- Admin panel de `htdocs/admin/` klasöründe, ayrı deploy gerekmez

---

## Mimari Genel Bakış

```
htdocs/
├── admin/
│   ├── index.html       ← Giriş ekranı (şifre)
│   ├── dashboard.html   ← Ana panel
│   ├── admin.css        ← Admin stilleri
│   └── admin.js         ← GitHub API işlemleri
├── data/
│   ├── about.json       ← Hakkımda verisi
│   └── projects.json    ← Proje verisi
├── about.html           ← JSON'dan render eder (JS ile)
├── project.html         ← JSON'dan render eder (JS ile)
└── ...
```

> [!IMPORTANT]
> `about.html` ve `project.html` sayfaları artık statik HTML içermez.
> Sayfa yüklenince `data/about.json` ve `data/projects.json` dosyalarını
> `fetch()` ile okur ve DOM'u JavaScript ile oluşturur.

---

## Faz 1 — Veri Modeli (JSON Şemaları)

### `data/about.json`

```json
{
  "profile": {
    "name": "Enes Sancar",
    "title": "Front-End Developer",
    "photo": "image/enes-about.jpg",
    "bio": "Merhaba! Ben Enes Sancar...",
    "location": "İstanbul, Türkiye"
  },
  "education": [
    {
      "id": "nfk-2019",
      "school": "Necip Fazıl Kısakürek Mesleki Teknik Anadolu Lisesi",
      "period": "2019–2023",
      "location": "Bahçelievler, İstanbul",
      "department": "Web Programlama"
    }
  ],
  "experience": [
    {
      "id": "boranet-2022",
      "role": "Teknik Servis",
      "company": "Boranet Bilgisayar",
      "location": "Küçükçekmece",
      "period": "2022"
    },
    {
      "id": "smartcargo-2023",
      "role": "Lojistik",
      "company": "Smart Cargo",
      "location": "Başakşehir",
      "period": "2023–2024"
    }
  ],
  "skills": [
    "HTML / CSS / JavaScript",
    "Bootstrap",
    "Figma",
    "Adobe Photoshop, Illustrator, After Effects",
    "SQL & Veritabanı",
    "Flutter & Dart",
    "WordPress"
  ],
  "interests": ["Movies", "Music", "Tennis", "Games", "Photograph"]
}
```

---

### `data/projects.json`

Mevcut sayfadan çıkardığım veri modeli — **7 farklı kart** var, aralarındaki farklar şunlar:

| Alan | CineForum | SuppWorld | Smart Cargo | Time Tracker |
|---|---|---|---|---|
| Thumbnail tipi | `img` | `img` | `img + cover-top` | `img` |
| Modal önizleme | Tek görsel | **Galeri** (3 görsel) | Tek görsel (sharp) | Tek görsel (sharp) |
| CTA butonu | Figma linki | — | Siteye git | PDF rapor |
| İkincil buton | Figma linki | — | Siteye git | — |
| Modal notu | — | Üniversite notu | İş notu | Üniversite notu |

```json
{
  "sections": [
    {
      "id": "uiux",
      "title": "UI/UX Tasarımları",
      "icon": "fa-brands fa-figma",
      "cardType": "figma"
    },
    {
      "id": "graphic",
      "title": "Grafik Tasarım",
      "icon": "fa-solid fa-palette",
      "cardType": "graphic"
    },
    {
      "id": "web",
      "title": "Web & Geliştirme",
      "icon": "fa-solid fa-code",
      "cardType": "dev"
    },
    {
      "id": "desktop",
      "title": "Masaüstü Uygulamalar",
      "icon": "fa-solid fa-desktop",
      "cardType": "desktop"
    }
  ],
  "projects": [
    {
      "id": "cineforum",
      "sectionId": "uiux",
      "title": "CineForum",
      "description": "Sinema ve dizi tutkunları için...",
      "tags": ["Figma", "UI/UX", "Mobil", "AI", "Sosyal"],
      "thumbnail": {
        "src": "image/projects/cineforum.png",
        "type": "img",
        "fit": "contain"
      },
      "buttons": {
        "detail": true,
        "secondary": {
          "label": "Figma'da aç",
          "icon": "fa-brands fa-figma",
          "href": "https://www.figma.com/..."
        }
      },
      "modal": {
        "badge": "UI/UX · Figma",
        "lead": "Sinema ve dizi tutkunlarını...",
        "preview": {
          "type": "single",
          "src": "image/projects/cineforum.png"
        },
        "sections": [
          {
            "heading": "Proje tanımı",
            "content": "CineForum, kullanıcıların..."
          },
          {
            "heading": "Temel özellikler",
            "type": "list",
            "items": [
              "<strong>Topluluk:</strong> ...",
              "<strong>AI öneriler:</strong> ..."
            ]
          }
        ],
        "note": null,
        "cta": {
          "label": "Figma dosyasını aç",
          "icon": "fa-brands fa-figma",
          "href": "https://www.figma.com/..."
        }
      }
    },
    {
      "id": "suppworld",
      "modal": {
        "preview": {
          "type": "gallery",
          "images": [
            { "src": "image/projects/suppworld-logo.png", "caption": "Logo" },
            { "src": "image/projects/suppworld-kartvizit.png", "caption": "Kartvizit" },
            { "src": "image/projects/suppworld-afis.png", "caption": "Reklam afişi" }
          ]
        }
      }
    }
  ]
}
```

---

## Faz 2 — Admin Güvenliği

### Kimlik Doğrulama Yöntemi

**GitHub Personal Access Token (PAT) tabanlı.**

```
Kullanıcı admin paneli açar
       ↓
Şifre + GitHub Token girer
       ↓
Token localStorage'a kaydedilir (session boyunca)
       ↓
Tüm GitHub API çağrıları bu token ile yapılır
       ↓
Sayfa kapatınca token temizlenir
```

> [!NOTE]
> Admin paneli `nsancar.com/admin/` adresinde herkese açık ama
> GitHub Token olmadan hiçbir şey kaydedilemez.
> Token'ı sadece sen bilirsin. Ekstra güvenlik için basit bir
> client-side şifre de önüne eklenebilir.

**GitHub PAT Yetkileri:**
- Repo: `Contents` → Read & Write (sadece bu yeterli)

---

## Faz 3 — Admin Panel Ekranları

### 3.1 Giriş Ekranı (`admin/index.html`)

```
┌─────────────────────────────────┐
│         nsancar.com             │
│          Admin Panel            │
│                                 │
│  GitHub Token: [_____________]  │
│                                 │
│         [Giriş Yap]             │
└─────────────────────────────────┘
```

### 3.2 Dashboard (`admin/dashboard.html`)

```
┌──────────────────────────────────────────────┐
│  ← nsancar.com  |  Admin Panel  |  Çıkış    │
├────────────────┬─────────────────────────────┤
│                │                             │
│  📋 Hakkımda   │   [Aktif sekme içeriği]     │
│  🗂 Projeler   │                             │
│                │                             │
└────────────────┴─────────────────────────────┘
```

### 3.3 Hakkımda Yönetimi

**Soldaki sidebar — 5 sekme:**

| Sekme | Alanlar | İşlemler |
|---|---|---|
| **Profil** | Ad, unvan, fotoğraf, lokasyon, bio | Düzenle |
| **Eğitim** | Okul, dönem, konum, bölüm | Ekle / Sil / Sırala |
| **Deneyim** | Rol, şirket, konum, dönem | Ekle / Sil / Sırala |
| **Yetenekler** | Beceri listesi | Ekle / Sil / Sırala |
| **İlgi Alanları** | Hobi listesi | Ekle / Sil |

**Fotoğraf yükleme:**
- Dosya seç → Base64'e çevir → GitHub API ile `image/enes-about.jpg`'yi güncelle
- Veya harici URL gir

### 3.4 Proje Yönetimi

**Sol panel:**
```
[+ Yeni Proje]
─────────────────
● CineForum         [✏] [🗑]
● FotoEyes          [✏] [🗑]
● SuppWorld         [✏] [🗑]
● Smart Cargo       [✏] [🗑]
● nsancar.com       [✏] [🗑]
● Time Tracker      [✏] [🗑]
```

**Proje Düzenleme Formu — Alanlar:**

```
KART BİLGİLERİ
──────────────
Bölüm:        [UI/UX ▼] [Grafik ▼] [Web ▼] [Masaüstü ▼]
Başlık:       [________________________]
Açıklama:     [________________________]
              [________________________]
Etiketler:    [Figma ×] [UI/UX ×] [+ Ekle]
Görsel:       [Dosya Seç] veya [URL]
Görsel tipi:  (●) contain  ( ) cover-top

BUTONLAR
────────
☑ Detayları Gör butonu göster
☑ İkincil buton:  Metin [______] İkon [______] URL [______]

MODAL DETAY
───────────
Badge:        [UI/UX · Figma]
Özet metin:   [________________________]

Önizleme tipi:  (●) Tek Görsel  ( ) Sharp  ( ) Galeri

[Galeri seçiliyse]
  Görsel 1: [Seç] Başlık: [______]
  Görsel 2: [Seç] Başlık: [______]
  [+ Görsel Ekle]

İçerik Bölümleri:
  [+ Bölüm Ekle]
  ┌─────────────────────────────┐
  │ Başlık: [_______________]   │
  │ Tip: (●) Paragraf ( ) Liste │
  │ İçerik: [_______________]   │
  │                    [🗑 Sil] │
  └─────────────────────────────┘

Not:  ☐ Ekle  İkon: [______]  Metin: [______]

CTA Butonu: ☑  Metin: [______]  İkon: [______]  URL: [______]

                    [İptal]  [Kaydet & Deploy]
```

---

## Faz 4 — GitHub API Entegrasyonu

### Dosya Okuma

```javascript
async function readFile(path) {
  const res = await fetch(
    `https://api.github.com/repos/EneSancar/nsancar.com/contents/htdocs/data/${path}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return {
    content: JSON.parse(atob(data.content)),
    sha: data.sha  // güncelleme için gerekli
  };
}
```

### Dosya Yazma (= Commit)

```javascript
async function writeFile(path, content, sha) {
  await fetch(
    `https://api.github.com/repos/EneSancar/nsancar.com/contents/htdocs/data/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `admin: update ${path}`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
        sha: sha
      })
    }
  );
  // Vercel bu commit'i algılar → otomatik deploy başlar
}
```

### Görsel Yükleme

```javascript
async function uploadImage(file, destPath) {
  const base64 = await fileToBase64(file);
  // GitHub'daki mevcut dosyanın sha'sını al (varsa)
  const existing = await getFileSha(destPath);
  await fetch(`https://api.github.com/repos/.../contents/${destPath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `admin: upload image ${destPath}`,
      content: base64,
      sha: existing?.sha
    })
  });
}
```

---

## Faz 5 — Sayfaların JSON'a Taşınması

### `project.html` — Değişim Öncesi vs Sonrası

**Önce:** 466 satır statik HTML (proje başına ~50 satır + modal ~30 satır)

**Sonra:**
```html
<main class="projects-page">
  <div class="container">
    <div class="projects-hero reveal">...</div>
    <div id="projectsContainer">
      <!-- JavaScript buraya render eder -->
    </div>
  </div>
</main>
<script>
  fetch('/data/projects.json')
    .then(r => r.json())
    .then(data => renderProjects(data));
</script>
```

**`renderProjects(data)`** fonksiyonu:
- `data.sections` → her bölüm için `<section>` oluşturur
- `data.projects` → her proje için `<article>` + `<template>` (modal) oluşturur
- Thumbnail tipi, buton konfigürasyonu, modal önizleme tipini otomatik yönetir

---

## Uygulama Sırası

```
Faz 1 — JSON şemaları oluştur (1-2 saat)
  ├─ data/about.json  (mevcut about.html içeriğini taşı)
  └─ data/projects.json  (mevcut 7 projeyi taşı)

Faz 2 — Sayfaları JSON'a bağla (2-3 saat)
  ├─ project.html → renderProjects()
  └─ about.html → renderAbout()

Faz 3 — Admin giriş ekranı (1 saat)
  └─ admin/index.html + token doğrulama

Faz 4 — Hakkımda yönetimi (2-3 saat)
  ├─ Form alanları
  ├─ GitHub API read/write
  └─ Fotoğraf yükleme

Faz 5 — Proje yönetimi (4-5 saat)
  ├─ Proje listesi (CRUD)
  ├─ Dinamik form (tüm alan tipleri)
  ├─ Görsel yükleme
  └─ Modal önizleme

Faz 6 — Deploy göstergesi (1 saat)
  └─ Kaydet sonrası "Deploy başladı, ~30 sn" bildirimi
```

**Toplam tahmini süre: ~12-15 saat geliştirme**

---

## Teknik Notlar

> [!WARNING]
> GitHub repo'su **public** ise `data/about.json` ve `data/projects.json`
> herkese görünür olur. Bu normal çünkü site zaten herkese açık.
> Admin token'ı asla JSON dosyalarına yazma.

> [!TIP]
> Admin paneli `nsancar.com/admin/` adresinde olacak.
> Vercel'de bu path'e şifre koruması eklemek istersen
> `vercel.json`'a password protection eklenebilir (Vercel Pro gerektirir).
> Ücretsiz alternatif: client-side şifre hash kontrolü.

> [!NOTE]
> Repo adı `nsancar.com` değil farklı bir şeyse GitHub API URL'sindeki
> `repo` parametresi güncellenmeli. Uygulama başlamadan önce kontrol et.
