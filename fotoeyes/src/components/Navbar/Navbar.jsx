import { Search, Eye } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Eye className="logo-icon" size={32} />
          <span className="logo-text">FotoEyes</span>
        </div>
        
        <div className="navbar-search">
          <input type="text" placeholder="Türkiye'nin Güzelliklerini Arayın" />
          <button className="search-btn"><Search size={20} /></button>
        </div>

        <ul className="navbar-links">
          <li><a href="#" className="active">Keşfet</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Hakkımızda</a></li>
          <li><a href="#">Destek</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="btn btn-dark">Oturum Aç</button>
          <button className="btn btn-primary">Kaydol</button>
        </div>
      </div>
    </nav>
  );
}
