import './CategoriesGrid.css';

const categories = [
  { id: 1, name: 'Şehir', img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Doğa', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'İnsan', img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Kedi', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Tarihi', img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'Sokak', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

export default function CategoriesGrid() {
  return (
    <section className="container categories-section">
      <div className="categories-header">
        <div>
          <h3 className="section-title" style={{marginBottom: '0.2rem'}}>Kategoriler</h3>
          <p className="categories-subtitle">hangisi ilginizi daha çok çekiyor?</p>
        </div>
        <a href="#" className="view-all-link">Tümünü gör &rarr;</a>
      </div>
      
      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <img src={cat.img} alt={cat.name} className="category-img" />
            <div className="category-overlay">
              <h4 className="category-name">{cat.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
