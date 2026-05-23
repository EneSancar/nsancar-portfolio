# nsancar.com — Günlük Çalışma Raporu

**Tarih:** 21 Mayıs 2026  
**Proje:** [EneSancar/nsancar-portfolio](https://github.com/EneSancar/nsancar-portfolio) → Vercel → [nsancar.com](https://nsancar.com)  
**Site kökü:** `htdocs/`

---

## 1. Özet

Bugün sitenin **içerik yönetimi (admin panel)** altyapısı kuruldu, aktiviteler sayfasına yeni bölümler eklendi, ardından panel **JSON editörden modern forma** geçirildi. Canlıda karşılaşılan sorunlar (yetkilendirme, eğitim listesi, fotoğraf flaşı, görsel yükleme, deploy gecikmesi) tek tek giderildi.

---

## 2. Aktiviteler sayfası (`fav.html`)

| Bölüm | Durum |
|--------|--------|
| **Favori Diziler** | Filtreler: Tümü / İzliyorum / Bitirdim / Listemde |
| **Favori Kanallar** | YouTube kanal kartları (şablon; içerik doldurulacak) |
| Üst pill linkleri | Kanallar, Dizi, Kütüphane |
| Stil + JS filtreleri | `style.css`, `script.js` |

*Not: Bu bölümler henüz admin paneline bağlı değil; HTML/JSON ile manuel veya ileride `activities.json`.*

---

## 3. Admin panel v1 — Altyapı

### Veri katmanı

- `htdocs/data/about.json` — Hakkımda içeriği
- `htdocs/data/projects.json` — Projeler + modal verileri

### Canlı sayfalar

- `about.html` + `js/about-renderer.js` → JSON'dan render
- `project.html` + `js/projects-renderer.js` → JSON'dan render

### Güvenli API (Vercel)

| Uç | Açıklama |
|----|----------|
| `POST /api/about` | Hakkımda JSON → GitHub |
| `POST /api/projects` | Projeler JSON → GitHub |
| `POST /api/upload` | Görsel yükleme → `htdocs/image/` |
| `GET /api/auth-check` | Admin giriş doğrulama |

`GITHUB_TOKEN` yalnızca sunucuda; tarayıcıda PAT yok.

### Admin arayüzü

- URL: **https://nsancar.com/admin/**
- Kurulum: `VERCEL-ADMIN-SETUP.md`, `htdocs/admin/README.md`

### Vercel ortam değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `ADMIN_SECRET` | Admin giriş + API auth |
| `GITHUB_TOKEN` | PAT — Contents: Read and write |
| `GITHUB_OWNER` | `EneSancar` |
| `GITHUB_REPO` | `nsancar-portfolio` |
| `GITHUB_BRANCH` | `main` |
| `GITHUB_PATH_PREFIX` | `htdocs/data/` |
| `GITHUB_SITE_PREFIX` | `htdocs/` (görsel yükleme) |

---

## 4. Admin panel v2 — Form arayüzü

JSON textarea kaldırıldı; yerine:

- Sol menülü **dashboard** tasarımı
- **Hakkımda:** profil, sosyal linkler, eğitim/deneyim (+ ekle / sil), yetenekler, ilgi alanları
- **Projeler:** liste + detay formları, modal bölümleri
- **Dosya seç & yükle** — profil ve proje görselleri

### İlgili dosyalar

```
htdocs/admin/
  index.html
  admin.css
  admin.js
  admin-core.js
  admin-about-ui.js
  admin-projects-ui.js
  admin-upload.js
  README.md
```

---

## 5. Hata düzeltmeleri

| Sorun | Çözüm |
|--------|--------|
| Kayıt: "Geçersiz admin kimlik bilgisi" | `ADMIN_SECRET` + redeploy; girişte sunucu doğrulama |
| `C.authHeaders is not a function` | `authHeaders` AdminCore'a export edildi |
| 2+ eğitim sitede görünmüyordu | Renderer yalnızca `education[0]` gösteriyordu → tüm kayıtlar |
| Deneyim başlıkları siliniyordu | `innerHTML` ile bölüm silme → güvenli ekleme |
| Eski profil fotoğrafı flaşı | Yükleme bitene kadar gizleme + preload |
| Projeler eski JSON / hero flaşı | Cache bust, hero gizleme |
| Görsel yükleme hatası | `/api/upload` + `GITHUB_SITE_PREFIX` |
| 3. eğitim kayboluyor | Deploy bitmeden Yenile eski JSON çekiyordu → yedek, uyarı, state güncelleme |
| Genel sağlamlık | `js/site-content.js`, dizi koruması, API doğrulama |

---

## 6. Git ve deploy

**Akış:** `main` branch push → Vercel otomatik deploy (~30–60 sn)

**Önemli commit temaları:**

1. Admin panel v1 (JSON + API)
2. Form tabanlı dashboard
3. Eğitim çoklu gösterim + görsel yükleme
4. Renderer sertleştirme (`site-content.js`)
5. Eğitim kaybı / reload deploy uyarısı (`7a20782`)

---

## 7. Çalışan içerik akışı

```
Admin panelde düzenle → Kaydet
    → Vercel API → GitHub (JSON + görseller)
    → Vercel deploy
    → nsancar.com güncellenir
```

**Önemli:** Deploy bitmeden **Yenile** veya sayfa yenileme → eski `about.json` görünebilir.

---

## 8. Sonraki adımlar (plan)

- [ ] Ana sayfa admin'den düzenleme
- [ ] `fav.html` (kütüphane, dizi, kanallar) → `activities.json` + admin
- [ ] Görsel kırpma / sürükle-bırak
- [ ] Favori kanallar içeriğinin doldurulması

---

## 9. Hızlı kontrol listesi

- [ ] Vercel deploy yeşil tik
- [ ] https://nsancar.com/about.html — tüm eğitimler (Ctrl+F5)
- [ ] https://nsancar.com/project.html — projeler
- [ ] https://nsancar.com/admin/ — formlar + görsel yükleme
- [ ] Kayıt sonrası ~1 dk bekle, sonra Yenile

---

*Bu rapor 21 Mayıs 2026 oturumunda yapılan işleri özetler.*
