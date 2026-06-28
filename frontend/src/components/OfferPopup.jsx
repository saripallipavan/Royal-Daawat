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
        setIsVisible(true);
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

  const getPromoLink = (link) => {
    if (!link) return '';
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    const separator = link.includes('?') ? '&' : '?';
    return `${link}${separator}promo=${activeOccasion}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="premium-popup-container"
          style={{
            backgroundColor: '#050a0f',
            border: '2px solid var(--primary-color)',
            borderRadius: '20px',
            maxWidth: banner.img ? '750px' : '500px',
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(182, 162, 94, 0.15)'
          }}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '15px', right: '15px',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(182, 162, 94, 0.3)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.3s'
            }}
            aria-label="Close Pop-up"
          >
            <X size={18} />
          </button>

          {banner.img ? (
            <div className="premium-popup-wrapper">
              {/* Text content column */}
              <div className="premium-popup-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(182, 162, 94, 0.1)', color: 'var(--primary-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem', width: 'fit-content', textTransform: 'capitalize' }}>
                  📢 {activeOccasion.replace(/([A-Z])/g, ' $1')}
                </div>
                <h2 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', marginBottom: '1rem', lineHeight: '1.3' }}>
                  {banner.title}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
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
                      to={getPromoLink(banner.link)} 
                      onClick={handleClose} 
                      className="btn btn-primary" 
                      style={{ width: '100%', display: 'block', textAlign: 'center' }}
                    >
                      {banner.buttonText || 'Learn More'}
                    </Link>
                  )
                )}
              </div>

              {/* Image column */}
              <div className="premium-popup-image" style={{ width: '100%', height: '100%', minHeight: '320px', borderLeft: '1px solid rgba(182, 162, 94, 0.15)' }}>
                <img 
                  src={getImageUrl(banner.img)}
                  alt={banner.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          ) : (
            /* Single Column Layout (No Image) */
            <div className="premium-popup-text no-image" style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(182, 162, 94, 0.1)', color: 'var(--primary-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'capitalize' }}>
                📢 {activeOccasion.replace(/([A-Z])/g, ' $1')}
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
                    to={getPromoLink(banner.link)} 
                    onClick={handleClose} 
                    className="btn btn-primary" 
                    style={{ width: '100%', display: 'block', textAlign: 'center' }}
                  >
                    {banner.buttonText || 'Learn More'}
                  </Link>
                )
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfferPopup;
