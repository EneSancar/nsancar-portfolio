import './HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <h1 className="hero-title">
          Anadolu'nun En Büyük<br />
          Fotoğraf Arşivi ve Komitesi
        </h1>
        <p className="hero-subtitle">
          Türkiye'nin eşsiz coğrafyasını teknik detaylarıyla keşfedin,<br />
          kendi rotalarınızı paylaşın ve fotoğraf tutkunlarıyla buluşun.
        </p>
        <button className="btn btn-light hero-btn">ÜCRETSİZ KAYDOL</button>
      </div>
    </section>
  );
}
