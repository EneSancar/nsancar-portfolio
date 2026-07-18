import { Globe2 } from 'lucide-react';
import './LocationGrid.css';

const locations = [
  { id: 1, name: 'İstanbul', img: 'https://images.unsplash.com/photo-1589030343991-69ea1433b941?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'Denizli', img: 'https://images.unsplash.com/photo-1585642686884-a11470dfbf1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Rize', img: 'https://images.unsplash.com/photo-1596489814120-6d0e806195fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'Burdur', img: 'https://images.unsplash.com/photo-1590409951681-370c0c00c73d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 5, name: 'Nevşehir', img: 'https://images.unsplash.com/photo-1601630138670-349f2b84ebac?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 6, name: 'Muğla', img: 'https://images.unsplash.com/photo-1616886419747-d0d4e3bb0766?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 7, name: 'Antalya', img: 'https://images.unsplash.com/photo-1542051812-f470129759e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 8, name: 'Artvin', img: 'https://images.unsplash.com/photo-1579802283842-8356193ff7db?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
];

export default function LocationGrid() {
  return (
    <section className="location-section">
      <div className="container location-container">
        <div className="location-content">
          <h2 className="location-title">Hangi konumu görmek isterdiniz ?</h2>
          <div className="location-grid">
            {locations.map(loc => (
              <div key={loc.id} className="location-item">
                <img src={loc.img} alt={loc.name} className="location-thumb" />
                <span className="location-name">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="location-icon-wrapper">
          <Globe2 size={120} strokeWidth={1} className="globe-icon" />
        </div>
      </div>
    </section>
  );
}
