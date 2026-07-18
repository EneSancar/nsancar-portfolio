import './PremiumBanner.css';

export default function PremiumBanner() {
  return (
    <section className="container">
      <div className="premium-banner">
        <div className="premium-content">
          <h2 className="premium-title">FotoEyes <span className="text-yellow">Premium</span> ile Sınırları Aşın</h2>
          <p className="premium-desc">
            tüm tur etkinliklerinde <span className="text-huge">%40</span> 'a varan indirimler<br />
            ve profesyonel portfolyo ayrıcalıkları sizi bekliyor
          </p>
          <button className="btn btn-dark premium-btn">Premium'a Geç</button>
        </div>
        <div className="premium-image">
          {/* Siluet resmi yerine geçici bir icon veya görsel temsili kullanılabilir. */}
          <img src="https://images.unsplash.com/photo-1554046920-90dc20696352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Photographer silhouette" className="silhoutte-img" />
        </div>
      </div>
    </section>
  );
}
