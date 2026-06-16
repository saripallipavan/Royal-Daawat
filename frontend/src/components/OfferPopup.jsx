import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../services/api';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfferPopup = ({ settings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const activeOccasion = settings?.activePopupOccasion || 'none';
  const banner = (activeOccasion !== 'none' && settings?.popupBanners) ? settings.popupBanners[activeOccasion] : null;

  useEffect(() => {
    if (banner && banner.title && activeOccasion !== 'none') {
      // Check if already seen recently (e.g. in this session)
      const dismissed = sessionStorage.getItem(`popupBannerDismissed_${activeOccasion}`);
      if (!dismissed) {
        // Slight delay before showing
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [banner, activeOccasion]);

  const handleClose = () => {
    setIsVisible(false);
    if (activeOccasion !== 'none') {
      sessionStorage.setItem(`popupBannerDismissed_${activeOccasion}`, 'true');
    }
  };

  if (!isVisible || !banner || activeOccasion === 'none') return null;

  const isExternalLink = banner.link && (banner.link.startsWith('http://') || banner.link.startsWith('https://'));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#050a0f',
            border: '2px solid var(--primary-color)',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <button 
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '15px', right: '15px',
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '30px', height: '30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={18} />
          </button>

          {banner.img && (
            <div style={{ width: '100%', height: '250px' }}>
              <img 
                src={getImageUrl(banner.img)}
                alt={banner.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(182, 162, 94, 0.1)', color: 'var(--primary-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              📢 Special Notice
            </div>
            <h2 className="cinzel-font text-gold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {banner.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              {banner.description}
            </p>
            
            {banner.link && (
              isExternalLink ? (
                <a 
                  href={banner.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={handleClose} 
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'block', textDecoration: 'none', textAlign: 'center' }}
                >
                  {banner.buttonText || 'Learn More'}
                </a>
              ) : (
                <Link 
                  to={banner.link} 
                  onClick={handleClose} 
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'block' }}
                >
                  {banner.buttonText || 'Learn More'}
                </Link>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfferPopup;
