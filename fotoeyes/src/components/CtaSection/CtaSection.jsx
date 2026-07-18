import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import './CtaSection.css';

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <div className="cta-illustration">
          {/* Mock illustration with standard Unsplash image since we don't have the original asset */}
          <div className="img-wrapper">
             <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Camera and city" className="illustration-img" />
          </div>
        </div>
        
        <div className="cta-content">
          <div className="cta-text-group">
            <h2 className="cta-title">Kendi Fotoğraflarınızı Ekleyebilirsiniz</h2>
            <ImageIcon size={60} className="cta-icon" />
          </div>
          
          <button className="cta-button">
            şimdi ekle <PlusCircle className="plus-icon" size={32} />
          </button>
        </div>
      </div>
    </section>
  );
}
