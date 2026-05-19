import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOffers } from '../services/api';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfferPopup = () => {
  const [activeOffer, setActiveOffer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getOffers();
        if (response.data && response.data.length > 0) {
          const now = new Date();
          const validOffer = response.data.find(offer => {
            const startDate = offer.startDate ? new Date(offer.startDate) : null;
            const endDate = offer.endDate ? new Date(offer.endDate) : null;
            const isActive = offer.active !== false;

            if (!isActive) return false;
            if (startDate && now < startDate) return false;
            if (endDate && now > endDate) return false;
            return true;
          });

          if (validOffer) {
            // Check if already seen recently (e.g. in this session)
            const seenOffers = JSON.parse(sessionStorage.getItem('seenOffers') || '[]');
            if (!seenOffers.includes(validOffer._id)) {
              setActiveOffer(validOffer);
              // Slight delay before showing
              setTimeout(() => setIsVisible(true), 1500);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching offers for popup:", err);
      }
    };

    fetchOffers();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (activeOffer) {
      const seenOffers = JSON.parse(sessionStorage.getItem('seenOffers') || '[]');
      seenOffers.push(activeOffer._id);
      sessionStorage.setItem('seenOffers', JSON.stringify(seenOffers));
    }
  };

  return (
    <AnimatePresence>
      {isVisible && activeOffer && (
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

            {activeOffer.image && (
              <div style={{ width: '100%', height: '250px' }}>
                <img 
                  src={activeOffer.image.startsWith('http') ? activeOffer.image : `http://localhost:5000/${activeOffer.image.replace(/\\\\/g, '/')}`}
                  alt={activeOffer.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                🔥 Special Offer
              </div>
              <h2 className="cinzel-font text-gold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {activeOffer.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                {activeOffer.description}
              </p>
              
              <Link to="/menu" onClick={handleClose} className="btn btn-primary" style={{ width: '100%', display: 'block' }}>
                Order Now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;
