# nsancar.com Admin Panel (v1)

Hakkımda (`data/about.json`) ve Projeler (`data/projects.json`) içeriğini **form tabanlı** modern panelden düzenle. Kayıtlar tarayıcıdan **doğrudan GitHub’a değil**, Vercel serverless API üzerinden yapılır; `GITHUB_TOKEN` yalnızca sunucu ortam değişkeninde tutulur.

## Arayüz

- **Hakkımda:** profil, sosyal linkler, eğitim, deneyim, yetenekler, ilgi alanları
- **Projeler:** sayfa başlığı, proje listesi, kart/modal alanları, içerik bölümleri ekle-sil

## Vercel ortam değişkenleri

Vercel → Project → Settings → Environment Variables (Production, Preview, Development):

| Değişken | Açıklama |
|----------|----------|
| `ADMIN_SECRET` | Admin girişi ve API yetkilendirmesi (güçlü, rastgele bir değer) |
| `GITHUB_TOKEN` | GitHub PAT — yalnızca `Contents: Read and write` |
| `GITHUB_OWNER` | `EneSancar` |
| `GITHUB_REPO` | `nsancar-portfolio` |
| `GITHUB_BRANCH` | `main` (veya varsayılan dal) |
| `GITHUB_PATH_PREFIX` | Repo kökünde dosya yolu. Site `htdocs` klasöründen deploy oluyorsa genelde `htdocs/data/` |

Mevcut Drive API için: `GOOGLE_DRIVE_API_KEY` (fav/galeri — admin v1 kapsamında değil).

Örnek dosya: repo kökündeki `.env.example`.

## API uçları

- `POST /api/about` — body: `about.json` şeması
- `POST /api/projects` — body: `projects.json` şeması

Yetkilendirme:

```
Authorization: Bearer <ADMIN_SECRET>
```

veya `X-Admin-Secret: <ADMIN_SECRET>`.

## Yerel geliştirme

Statik dosyalar (`about.html`, JSON fetch) için:

```powershell
cd htdocs
npx --yes serve .
```

- `http://localhost:3000/about.html` ve `project.html` JSON’dan render eder.
- Admin kaydetme **çalışmaz** (API yok) — bunun için Vercel CLI:

```powershell
cd c:\Users\USER-001\Desktop\nsancar.com
npx vercel dev
```

`.env.local` içine yukarıdaki değişkenleri ekleyin, ardından `http://localhost:3000/admin/`.

## Deploy

1. Değişiklikleri `EneSancar/nsancar-portfolio` reposuna push edin.
2. Vercel otomatik deploy eder (`vercel.json` → `outputDirectory: htdocs`).
3. Admin: `https://nsancar.com/admin/`

Kayıt sonrası GitHub commit → Vercel yeniden deploy (~30 sn).

## v2 planı

- Sekmeli form arayüzü (JSON editör yerine)
- Görsel yükleme (GitHub Contents API)
- Ana sayfa ve `fav.html` / aktiviteler JSON
- Deploy durumu göstergesi
