import './Footer.css';

const streamPhotos = [
  'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1560031899-7fb602336336?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1601630138670-349f2b84ebac?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1572889664539-75783d6aeb9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-brand">
          <h2 className="footer-logo">FotoEyes</h2>
          <p className="footer-desc">
            Fotoeyes, fotoğrafçıların yaratıcılığını merkeze alan bir keşif platformudur.
            Amacımız, her seviyeden görsel sanatçının çekimlerini yüksek kalitede
            sergilemesini sağlamak ve profesyonel portfolyo paylaşımını tek tıkla
            mümkün kılarak yetenekleri doğru kitlelerle buluşturmaktır.
          </p>
          <div className="social-links">
            <a href="#">X</a>
            <a href="#">Fb</a>
            <a href="#">Ig</a>
            <a href="#">In</a>
          </div>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Linkler</h4>
          <ul>
            <li><a href="#">Ana Sayfa</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Galeri</a></li>
            <li><a href="#">Hakkımızda</a></li>
            <li><a href="#">İletişim</a></li>
          </ul>
        </div>

        <div className="footer-stream">
          <h4 className="footer-title">Fotoğraf Akışı</h4>
          <div className="stream-grid">
            {streamPhotos.map((src, index) => (
              <img key={index} src={src} alt="Stream photo" className="stream-img" />
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  );
}
