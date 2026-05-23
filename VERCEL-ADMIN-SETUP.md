# Admin panel — Vercel kurulum (5 dk)

Site canlıya alındıktan sonra `https://nsancar.com/admin/` üzerinden Hakkımda ve Projeler içeriğini düzenleyebilirsin.

## 1. GitHub Personal Access Token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained** (veya classic).
2. Repo: `EneSancar/nsancar-portfolio` — izin: **Contents: Read and write**.
3. Token’ı kopyala (`ghp_...` veya `github_pat_...`).

## 2. Admin gizli anahtarı

Güçlü rastgele bir değer üret (ör. 32+ karakter). Bu hem Vercel’de `ADMIN_SECRET` hem admin giriş ekranında kullanılır.

## 3. Vercel ortam değişkenleri

Vercel → proje → **Settings** → **Environment Variables**  
**Production**, **Preview** ve **Development** için ekle:

| Değişken | Örnek |
|----------|--------|
| `ADMIN_SECRET` | (ürettiğin gizli anahtar) |
| `GITHUB_TOKEN` | (PAT) |
| `GITHUB_OWNER` | `EneSancar` |
| `GITHUB_REPO` | `nsancar-portfolio` |
| `GITHUB_BRANCH` | `main` |
| `GITHUB_PATH_PREFIX` | `htdocs/data/` |
| `GITHUB_SITE_PREFIX` | `htdocs/` (görsel yükleme için) |

`GOOGLE_DRIVE_API_KEY` zaten fav galerisi için varsa dokunma.

## 4. Deploy

Kod push edildikten sonra Vercel otomatik deploy eder (`vercel.json` → `outputDirectory: htdocs`).

## 5. Redeploy (önemli)

Ortam değişkeni ekledikten sonra mutlaka **Deployments → son deploy → Redeploy** yap.  
Aksi halde kayıt *"Geçersiz admin kimlik bilgisi"* hatası verir.

## 6. İlk test

1. `https://nsancar.com/about.html` — içerik JSON’dan geliyor mu?
2. `https://nsancar.com/admin/` — `ADMIN_SECRET` ile giriş.
3. Küçük bir metin değişikliği → **Kaydet** → GitHub’da `htdocs/data/*.json` commit oluşmalı.
4. ~30 sn sonra site güncellenir (yeni deploy).

## Yerel test (isteğe bağlı)

```powershell
cd c:\Users\USER-001\Desktop\nsancar.com
# .env.local dosyasına .env.example değerlerini kopyala
npx vercel dev
```

`http://localhost:3000/admin/` — kayıt burada da API ile çalışır.

## Sorun giderme

| Belirti | Çözüm |
|---------|--------|
| 401 Unauthorized | `ADMIN_SECRET` giriş ile Vercel’deki aynı mı? |
| `missing_github_config` | `GITHUB_*` değişkenleri eksik |
| `github_write_failed` | PAT’te Contents yazma izni; repo adı doğru mu? |
| Dosya yanlış yerde | `GITHUB_PATH_PREFIX` → repo’da JSON gerçekten `htdocs/data/` altında mı? |

Detay: `htdocs/admin/README.md`
