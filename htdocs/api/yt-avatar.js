function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "url parametresi gerekli." });
    return;
  }

  let targetUrl;
  try {
    targetUrl = new URL(url);
  } catch {
    res.status(400).json({ error: "Geçersiz URL." });
    return;
  }

  const allowed = ["youtube.com", "www.youtube.com", "m.youtube.com"];
  if (!allowed.includes(targetUrl.hostname)) {
    res.status(400).json({ error: "Yalnızca YouTube URL'leri destekleniyor." });
    return;
  }

  try {
    // YouTube sayfasını fetch et
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      res.status(502).json({ error: `YouTube ${response.status} döndürdü.` });
      return;
    }

    const html = await response.text();
    let avatar = null;
    let channelName = null;

    // Yöntem 1: JSON-LD içinden avatar çek (en güvenilir)
    // YouTube sayfasında <script type="application/ld+json"> bloğu var
    const ldJsonMatches = html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    for (const m of ldJsonMatches) {
      try {
        const ld = JSON.parse(m[1]);
        // Kanal sayfalarında @type: "BreadcrumbList" veya itemListElement içinde
        // Veya doğrudan Person/Organization olabilir
        if (ld && ld.thumbnailUrl) {
          avatar = Array.isArray(ld.thumbnailUrl) ? ld.thumbnailUrl[0] : ld.thumbnailUrl;
        }
        if (ld && ld.name) {
          channelName = ld.name;
        }
      } catch {}
    }

    // Yöntem 2: ytInitialData JSON içinden avatar çek
    if (!avatar) {
      // YouTube sayfasında var ytInitialData = {...} şeklinde büyük bir JSON var
      const initDataMatch = html.match(/var\s+ytInitialData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
      if (initDataMatch) {
        try {
          const ytData = JSON.parse(initDataMatch[1]);
          // Header → channel avatar
          const header =
            ytData?.header?.c4TabbedHeaderRenderer ||
            ytData?.header?.pageHeaderRenderer;

          if (header) {
            // c4TabbedHeaderRenderer yolu
            const thumbs = header.avatar?.thumbnails;
            if (thumbs && thumbs.length) {
              // En büyük thumbnail'i al
              avatar = thumbs[thumbs.length - 1].url;
            }
          }

          // pageHeaderRenderer yolu (yeni YouTube layout)
          if (!avatar && ytData?.header?.pageHeaderRenderer) {
            const phr = ytData.header.pageHeaderRenderer;
            const imgModel =
              phr?.content?.pageHeaderViewModel?.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image?.sources;
            if (imgModel && imgModel.length) {
              avatar = imgModel[imgModel.length - 1].url;
            }
          }

          // metadata'dan kanal adını al
          if (!channelName) {
            channelName =
              ytData?.metadata?.channelMetadataRenderer?.title ||
              header?.title;
          }
        } catch {}
      }
    }

    // Yöntem 3: og:image fallback (bazen banner olabilir ama hiç yoktan iyi)
    if (!avatar) {
      avatar =
        html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1] ||
        html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i)?.[1];
    }

    // Yöntem 4: itemprop="thumbnailUrl" içinden
    if (!avatar) {
      avatar = html.match(/<link\s+itemprop="thumbnailUrl"\s+href="([^"]+)"/i)?.[1];
    }

    // Kanal adı fallback
    if (!channelName) {
      channelName =
        html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] ||
        html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i)?.[1];
    }

    if (!avatar) {
      res.status(404).json({
        error: "Profil fotoğrafı bulunamadı. YouTube bot koruması aktif olabilir.",
        hint: "Manuel olarak kanal sayfasından profil fotoğrafını sağ tık → 'Görsel adresini kopyala' ile alabilirsiniz.",
      });
      return;
    }

    // https ile başlamasını garanti et
    if (avatar.startsWith("//")) avatar = "https:" + avatar;

    // Yüksek çözünürlüklü versiyonu al (YouTube s88 → s800 gibi)
    avatar = avatar.replace(/=s\d+-/, "=s800-");

    res.status(200).json({ avatar, name: channelName || null });
  } catch (err) {
    res.status(500).json({ error: `Fetch hatası: ${err.message}` });
  }
};
