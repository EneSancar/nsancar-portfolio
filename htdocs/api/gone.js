// Retired IKU project URLs must be crawled as permanently removed so that
// search engines can clear their old index entries.
module.exports = function handler(_req, res) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.status(410).send("Bu içerik kalıcı olarak kaldırıldı.");
};
