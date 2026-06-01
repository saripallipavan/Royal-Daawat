import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu as MenuIcon, X, ChevronRight, Phone, Clock, MapPin } from 'lucide-react';
import { useContext } from 'react';

import logoImg from './assets/logo.jpg';
import heroBg from './assets/hero_bg.png';
import dish1 from './assets/dish1.jpg';
import dish2 from './assets/dish2.jpg';
import dish3 from './assets/dish3.jpg';
import { getMenu, getSettings } from './services/api';
import MapWrapper from './components/MapWrapper';

// Shared Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};



// --- COMPONENTS ---

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', width: '100%', top: 0, zIndex: 50,
      transition: 'all 0.4s ease',
      backgroundColor: isScrolled ? 'rgba(5, 16, 24, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.1)' : 'none',
      padding: isScrolled ? '1rem 0' : '1.5rem 0'
    }}>
      <div className="nav-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={logoImg} 
            alt="Royal Daawat Logo" 
            className="logo-img"
            style={{ 
              width: isScrolled ? '55px' : '75px', 
              height: isScrolled ? '55px' : '75px', 
              borderRadius: '50%',
              border: '2px solid var(--primary-color)',
              boxShadow: isScrolled ? '0 0 10px rgba(212, 175, 55, 0.3)' : '0 0 15px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.3s ease-in-out'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isScrolled ? '0 0 10px rgba(212, 175, 55, 0.3)' : '0 0 15px rgba(212, 175, 55, 0.4)';
            }}
          />
          <div className="logo-text" style={{ transition: 'all 0.3s ease' }}>
            <h1 className="cinzel-font text-gold" style={{ 
              fontSize: isScrolled ? '1.3rem' : '1.6rem', 
              lineHeight: 1,
              transition: 'font-size 0.3s ease'
            }}>ROYAL DAAWAT</h1>
            <span style={{ 
              fontSize: isScrolled ? '0.7rem' : '0.78rem', 
              letterSpacing: '2px', 
              color: 'var(--text-muted)',
              transition: 'font-size 0.3s ease',
              display: 'block',
              marginTop: '4px'
            }}>FLAVOURS OF INDIA</span>
          </div>
        </Link>

        <div className="desktop-menu">
          {[
            { name: 'HOME', path: '/' },
            { name: 'ABOUT US', path: '/about' },
            { name: 'DINE-IN MENU', path: '/menu' },
            { name: 'BOOK A TABLE', path: '/book-table' },
            { name: 'GIFT CARD', path: '/gift-card' },
            { name: 'MEDIA', path: '/media' },
            { name: 'TERMS & CONDITIONS', path: '/terms' },
            { name: 'CONTACT US', path: '/contact' }
          ].map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="desktop-menu-link"
              style={{ 
                fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', 
                color: location.pathname === item.path ? 'var(--primary-color)' : 'var(--text-main)',
                transition: 'color 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === item.path ? 'var(--primary-color)' : 'var(--text-main)'}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X color="var(--primary-color)" size={28} /> : <MenuIcon color="var(--primary-color)" size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-drawer"
          >
            {[
              { name: 'HOME', path: '/' },
              { name: 'ABOUT US', path: '/about' },
              { name: 'DINE-IN MENU', path: '/menu' },
              { name: 'BOOK A TABLE', path: '/book-table' },
              { name: 'GIFT CARD', path: '/gift-card' },
              { name: 'MEDIA', path: '/media' },
              { name: 'TERMS & CONDITIONS', path: '/terms' },
              { name: 'CONTACT US', path: '/contact' }
            ].map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.name}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-drawer-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Global Footer Component
const Footer = () => {
  const [settings, setSettings] = React.useState({
    restaurantName: 'Royal Daawat',
    phoneNumber: '+01425 476563',
    address: '14 Market Pl, Ringwood BH24 1AW',
    openingHours: 'Monday – Sunday : 05 PM – 11 PM',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2516.3268800985556!2d-1.7946950232497645!3d50.84351336154673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4873998f804597b9%3A0xe53bcbeab7d73010!2s14%20Market%20Pl%2C%20Ringwood%20BH24%201AW%2C%20UK!5e0!3m2!1sen!2sus!4v1715844857416!5m2!1sen!2sus',
    facebookUrl: 'https://www.facebook.com/people/Royal-Daawat/61565689980459/?mibextid=LQQJ4d&rdid=hgQhiVuThkWuTs0e&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1kUkV4EWVqiogDHF%2F%3Fmibextid%3DLQQJ4d',
    instagramUrl: 'https://www.instagram.com/royaldaawatuk/?igsh=MXUwODF4dmpnNmthNA%3D%3D#',
    tiktokUrl: 'https://www.tiktok.com/@royaldaawatuk'
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        if (data) {
          setSettings(prev => ({
            ...prev,
            restaurantName: data.restaurantName || prev.restaurantName,
            phoneNumber: data.phoneNumber || prev.phoneNumber,
            address: data.address || prev.address,
            openingHours: data.openingHours || prev.openingHours,
            googleMapsUrl: data.googleMapsUrl || prev.googleMapsUrl,
            facebookUrl: data.facebookUrl || prev.facebookUrl,
            instagramUrl: data.instagramUrl || prev.instagramUrl,
            tiktokUrl: data.tiktokUrl || prev.tiktokUrl
          }));
        }
      } catch (err) {
        console.error('Failed to load footer settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer style={{ marginTop: 'auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        
        {/* Column 1: Opening Hours */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'var(--dark-bg)', color: '#f4f4f4', padding: '5rem 2rem', textAlign: 'center', borderRight: '1px solid rgba(212, 175, 55, 0.05)' }}>
          <h3 className="cinzel-font" style={{ fontSize: '2.5rem', marginBottom: '2.5rem', color: 'var(--primary-color)' }}>Opening Hours</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', letterSpacing: '1px' }}>{settings.openingHours}</p>
          <Link to="/contact" className="btn" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--dark-bg)', border: '1px solid var(--primary-color)', borderRadius: '30px', fontWeight: 'bold' }}>Book Now</Link>
        </div>

        {/* Column 2: Contact Us */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'var(--light-bg)', color: '#ffffff', padding: '5rem 2rem', textAlign: 'center', borderRight: '1px solid rgba(212, 175, 55, 0.05)' }}>
          <h3 className="cinzel-font" style={{ fontSize: '2.5rem', marginBottom: '2.5rem', color: 'var(--primary-color)' }}>Contact Us</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Phone: {settings.phoneNumber}</p>
          <a href="mailto:info@royaldaawat.co.uk" style={{ fontSize: '1.1rem', display: 'block', marginBottom: '3rem', textDecoration: 'underline', color: 'inherit' }}>info@royaldaawat.co.uk</a>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>{settings.address}</p>
          <Link to="/menu" className="btn" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--dark-bg)', border: '1px solid var(--primary-color)', borderRadius: '30px', fontWeight: 'bold' }}>Dine-in Menu</Link>
        </div>

        {/* Column 3: Social Links */}
        <div style={{ flex: '1 1 300px', backgroundColor: 'var(--dark-bg)', color: '#f4f4f4', padding: '5rem 2rem', textAlign: 'center' }}>
          <h3 className="cinzel-font" style={{ fontSize: '2.5rem', marginBottom: '2.5rem', color: 'var(--primary-color)' }}>Follow Us</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6, padding: '0 1rem' }}>
            Stay updated with our latest offers and news by following us on social media.
          </p>
          <Link to="/book-table" className="btn" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--dark-bg)', border: '1px solid var(--primary-color)', borderRadius: '30px', fontWeight: 'bold' }}>Book A Table</Link>
        </div>

      </div>

      {/* Map Area */}
      {settings.googleMapsUrl && (
        <MapWrapper googleMapsUrl={settings.googleMapsUrl} height="350px" />
      )}
      
      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#04100c', color: '#fff', fontSize: '0.9rem' }}>
        <p style={{ marginBottom: '1rem', fontSize: '1rem' }}>Connect with us on our social media platforms.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '1.5rem' }}>
          {settings.facebookUrl && (
            <a 
              href={settings.facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#fff', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          )}
          {settings.instagramUrl && (
            <a 
              href={settings.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#fff', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          )}
          {settings.tiktokUrl && (
            <a 
              href={settings.tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#fff', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>
          )}
        </div>
        <p>Copyright &copy; 2026 {settings.restaurantName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

// --- PAGES ---

// Home Page
import { 
  SignatureDishes, 
  GalleryPreview, 
  WhyChooseUs, 
  SpecialOffers, 
  ChefRecommendations, 
  Testimonials, 
  Experience, 
  ContactPreview 
} from './components/HomeSections';

// About Us Section (specifically for Homepage on mobile)
const AboutUsSection = () => {
  return (
    <section className="about-us-homepage-section" style={{
      backgroundColor: 'var(--light-bg)',
      padding: '80px 0',
      borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
    }}>
      <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h2 className="cinzel-font text-gold" style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>About Us</h2>
        <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '0 auto 1.5rem' }}></div>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
          At Royal Daawat, we bring you an authentic taste of India, blending the rich culinary heritage of the subcontinent with a royal dining experience. Our mission is to take your taste buds on a flavorful journey through the diverse regions of India, offering a vibrant menu that showcases traditional recipes, bold spices, and time-honored cooking techniques.
        </p>
        <Link to="/about" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '10px 25px' }}>Read Our Story</Link>
      </div>
    </section>
  );
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=1600"
];

// Home Page
const HomePage = () => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 200]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="homepage-sections-container"
    >
      <section className="hero-section" style={{
        height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', overflow: 'hidden', isolation: 'isolate'
      }}>
        {/* Parallax Background Container */}
        <motion.div 
          style={{ 
            y: yBg,
            position: 'absolute', top: 0, left: 0, width: '100%', height: '120%', zIndex: -1
          }}
        >
          {/* Luxury Royal Background */}
          <div className="hero-luxury-bg" style={{ backgroundImage: 'none' }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `linear-gradient(135deg, rgba(5, 22, 14, 0.93) 0%, rgba(11, 46, 31, 0.9) 45%, rgba(15, 61, 42, 0.88) 75%, rgba(7, 31, 20, 0.93) 100%), url(${HERO_IMAGES[currentImageIndex]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: -3
                }}
              />
            </AnimatePresence>

            <div className="hero-glow-light-1" />
            <div className="hero-glow-light-2" />
            <div className="hero-shimmer" />
            <div className="hero-gold-line hero-gold-line-1" />
            <div className="hero-gold-line hero-gold-line-2" />
          </div>
        </motion.div>
        
        <motion.div className="container" variants={staggerContainer} initial="hidden" animate="visible" style={{ zIndex: 10 }}>
          <motion.h1 variants={fadeInUp} className="cinzel-font text-gold" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            Welcome to Royal Daawat
          </motion.h1>
          <motion.p variants={fadeInUp} style={{ fontSize: '1.2rem', letterSpacing: '4px', margin: '1.5rem 0 3.5rem', color: '#fff' }}>
            AUTHENTIC INDIAN CUISINE IN WALTON
          </motion.p>
          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book-table" className="btn hero-btn-book">BOOK NOW</Link>
            <Link to="/menu" className="btn hero-btn-order">ORDER ONLINE</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* RENDERED ON MOBILE IN POSITION 3, HIDDEN ON DESKTOP */}
      <AboutUsSection />

      {/* NEW SECTIONS */}
      <SignatureDishes />
      <WhyChooseUs />
      <ChefRecommendations />
      <GalleryPreview images={[
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800"
      ]} />
      <Testimonials />
      <Experience />
      <ContactPreview />
    </motion.div>
  );
};

// About Page
const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh' }}>
        <div style={{ width: '100%', height: '400px', backgroundImage: `url(${dish1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}></div>
        
        <div className="container section-padding" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="cinzel-font text-main" style={{ fontSize: '2.5rem', marginBottom: '2.5rem', color: '#fff' }}>Royal Daawat - Flavours of India!</h2>
            
            <div style={{ color: 'var(--text-muted)', lineHeight: 2, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <p>At Royal Daawat, we bring you an authentic taste of India, blending the rich culinary heritage of the subcontinent with a royal dining experience. Our mission is to take your taste buds on a flavorful journey through the diverse regions of India, offering a vibrant menu that showcases traditional recipes, bold spices, and time-honored cooking techniques.</p>
              <p>From the aromatic curries of the North to the spicy delights of the South, the tangy flavors of the West, and the delicate coastal dishes of the East, every plate at Royal Daawat is a celebration of India's culinary diversity. We use only the freshest ingredients and a blend of handpicked spices to create dishes that are rich in flavor and full of authenticity.</p>
              <p>Whether you're savoring our signature biryanis, indulging in our succulent tandoori kebabs, or enjoying our wide array of vegetarian and vegan specialties, each bite is designed to delight. Our chefs, with years of experience and a passion for Indian cuisine, ensure that every dish not only tastes exceptional but also tells a story of India's vibrant food culture.</p>
              <p>Step into Royal Daawat and experience the true Flavours of India—a place where every meal is a royal feast.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};



// NotFound Page Component
const NotFoundPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      style={{
        backgroundColor: 'var(--dark-bg)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 20px',
        color: '#fff'
      }}
    >
      <div style={{ maxWidth: '600px' }}>
        <h1 className="cinzel-font text-gold" style={{ fontSize: '6rem', margin: 0, lineHeight: 1 }}>404</h1>
        <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '20px auto' }}></div>
        <h2 className="cinzel-font" style={{ fontSize: '2rem', marginBottom: '20px' }}>Feast Not Found</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '40px' }}>
          The page you are looking for has vanished like tandoor smoke. Let us guide you back to our main table.
        </p>
        <Link to="/" className="btn" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--dark-bg)', borderRadius: '30px', padding: '12px 35px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
          Return to Home
        </Link>
      </div>
    </motion.div>
  );
};

// --- PAGES ---
import Menu from './pages/Menu';
import Media from './pages/Media';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import GiftCard from './pages/GiftCard';
import Login from './pages/Login';
import BookTable from './pages/BookTable';
import AdminDashboard from './pages/AdminDashboard';

import OfferPopup from './components/OfferPopup';

// Main App Router Content
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navigation />}
      
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/media" element={<Media />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gift-card" element={<GiftCard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book-table" element={<BookTable />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <OfferPopup />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
