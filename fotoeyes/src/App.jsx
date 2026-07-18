import Navbar from './components/Navbar/Navbar';
import HeroBanner from './components/HeroBanner/HeroBanner';
import PremiumBanner from './components/PremiumBanner/PremiumBanner';
import RegionsCarousel from './components/RegionsCarousel/RegionsCarousel';
import LocationGrid from './components/LocationGrid/LocationGrid';
import CategoriesGrid from './components/CategoriesGrid/CategoriesGrid';
import CtaSection from './components/CtaSection/CtaSection';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <PremiumBanner />
      <RegionsCarousel />
      <LocationGrid />
      <CategoriesGrid />
      <CtaSection />
      <Footer />
    </>
  );
}

export default App;
