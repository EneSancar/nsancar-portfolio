import './RegionsCarousel.css';

const regions = [
  { id: 1, name: 'Marmara Bölgesi', img: 'https://images.unsplash.com/photo-1572889664539-75783d6aeb9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Akdeniz Bölgesi', img: 'https://images.unsplash.com/photo-1560031899-7fb602336336?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Ege Bölgesi', img: 'https://images.unsplash.com/photo-1590518330089-a212349e29a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Doğu Anadolu', img: 'https://images.unsplash.com/photo-1589801258579-18e091f4ca26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
];

export default function RegionsCarousel() {
  return (
    <section className="container regions-section">
      <h3 className="section-title">Coğrafi Bölgeler</h3>
      <div className="regions-carousel">
        {regions.map(region => (
          <div key={region.id} className="region-card">
            <img src={region.img} alt={region.name} className="region-img" />
            <div className="region-overlay">
              <h4 className="region-name">{region.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
