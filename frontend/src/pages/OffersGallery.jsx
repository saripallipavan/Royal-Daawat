import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getOffers, getGallery } from '../services/api';
import { X, ChevronLeft, ChevronRight, Tags, ImageIcon, ArrowUpRight } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const OffersGallery = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const [offersRes, galleryRes] = await Promise.all([
          getOffers().catch(() => ({ data: [] })),
          getGallery().catch(() => ({ data: [] }))
        ]);

        setOffers(offersRes.data || []);
        // Sort gallery items by sortOrder ascending
        const sortedGallery = (galleryRes.data || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setGallery(sortedGallery);
      } catch (err) {
        console.error("Error loading Offers and Gallery data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${cleanBase}/${cleanPath.replace(/\\/g, '/')}`;
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prevIndex) => (prevIndex === 0 ? gallery.length - 1 : prevIndex - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prevIndex) => (prevIndex === gallery.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Offers & Gallery</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
            Exclusive Deals and Visual Culinary Journey
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(182, 162, 94, 0.1)', borderTop: '3px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>Loading gallery and offers...</p>
          </div>
        ) : (
          <>
            {/* Section 1: Special Offers */}
            <section style={{ marginBottom: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}>
                <Tags color="var(--primary-color)" size={24} />
                <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '1px' }}>Special Offers</h3>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(182, 162, 94, 0.15)' }}></div>
              </div>

              {offers.filter(o => o.active !== false).length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}
                >
                  {offers.filter(o => o.active !== false).map((offer) => (
                    <motion.div
                      key={offer._id}
                      variants={fadeInUp}
                      whileHover={{ y: -8 }}
                      style={{
                        position: 'relative',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        height: '420px',
                        border: '1px solid rgba(182, 162, 94, 0.1)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                    >
                      <ImageWithFallback 
                        src={getImageUrl(offer.image)} 
                        alt={offer.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.65)' }}></div>
                      
                      {offer.discount_percentage && (
                        <div style={{ 
                          position: 'absolute', top: '20px', right: '20px', 
                          backgroundColor: 'var(--primary-color)', color: '#000', 
                          padding: '6px 16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.85rem' 
                        }}>
                          {offer.discount_percentage}% OFF
                        </div>
                      )}
                      
                      <div style={{ position: 'absolute', bottom: '30px', left: '30px', right: '30px' }}>
                        <h4 className="cinzel-font text-gold" style={{ fontSize: '1.6rem', marginBottom: '0.8rem', lineHeight: 1.3 }}>
                          {offer.title}
                        </h4>
                        <p style={{ color: '#fff', opacity: 0.8, fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                          {offer.description}
                        </p>
                        <button 
                          onClick={() => navigate('/menu')} 
                          className="btn btn-primary" 
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          CLAIM OFFER <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div style={{ 
                  textAlign: 'center', padding: '4rem 2rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.01)', 
                  border: '1px dashed rgba(182, 162, 94, 0.15)', 
                  borderRadius: '15px', color: 'var(--text-muted)'
                }}>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>No active offers today. Check back later!</p>
                </div>
              )}
            </section>

            {/* Section 2: Photo Gallery */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}>
                <ImageIcon color="var(--primary-color)" size={24} />
                <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '1px' }}>Photo Gallery</h3>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(182, 162, 94, 0.15)' }}></div>
              </div>

              {gallery.length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}
                >
                  {gallery.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setLightboxIndex(idx)}
                      style={{
                        height: '240px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      <ImageWithFallback 
                        src={getImageUrl(item.image)} 
                        alt={item.title || "Gallery Image"} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div className="gallery-hover-overlay" style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(11, 46, 31, 0.85)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.3s ease', padding: '20px', textAlign: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <h4 className="cinzel-font text-gold" style={{ fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                          {item.title || "View Image"}
                        </h4>
                        {item.subtitle && (
                          <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, opacity: 0.9, lineHeight: 1.4 }}>
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div style={{ 
                  textAlign: 'center', padding: '4rem 2rem', 
                  backgroundColor: 'rgba(255, 255, 255, 0.01)', 
                  border: '1px dashed rgba(182, 162, 94, 0.15)', 
                  borderRadius: '15px', color: 'var(--text-muted)'
                }}>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>No gallery images uploaded yet.</p>
                </div>
              )}
            </section>
          </>
        )}

      </div>

      {/* Lightbox Modal for Gallery Images */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px'
            }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', zIndex: 10
              }}
              title="Close"
            >
              <X size={32} />
            </button>

            {/* Left Control Arrow */}
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute', left: '20px',
                background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff',
                width: '50px', height: '50px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
              title="Previous"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Lightbox Image & Title */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                maxWidth: '90%', maxHeight: '80%'
              }}
            >
              <img
                src={getImageUrl(gallery[lightboxIndex].image)}
                alt={gallery[lightboxIndex].title || "Gallery"}
                style={{
                  maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain',
                  border: '2px solid var(--primary-color)', borderRadius: '4px'
                }}
              />
              {gallery[lightboxIndex].title && (
                <h4 className="cinzel-font text-gold" style={{ fontSize: '1.5rem', marginTop: '20px', marginBottom: '4px', textAlign: 'center' }}>
                  {gallery[lightboxIndex].title}
                </h4>
              )}
              {gallery[lightboxIndex].subtitle && (
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', margin: '0 auto', maxWidth: '600px', textAlign: 'center', lineHeight: 1.5 }}>
                  {gallery[lightboxIndex].subtitle}
                </p>
              )}
            </motion.div>

            {/* Right Control Arrow */}
            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute', right: '20px',
                background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff',
                width: '50px', height: '50px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
              title="Next"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default OffersGallery;
