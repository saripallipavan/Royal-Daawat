import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryCard from '../components/GalleryCard';
import ImageWithFallback from '../components/ImageWithFallback';
import { getGallery } from '../services/api';

// Importing all project assets
import dish1 from '../assets/dish1.jpg';
import dish2 from '../assets/dish2.jpg';
import dish3 from '../assets/dish3.jpg';
import hero from '../assets/hero.png';
import heroBg from '../assets/hero_bg.png';
import logo from '../assets/logo.jpg';

const Gallery = () => {
  // Using all available images from project assets
  const [images, setImages] = useState([
    { id: 'a1', image: dish1, title: 'Signature Dish' },
    { id: 'a2', image: dish2, title: 'Royal Platter' },
    { id: 'a3', image: dish3, title: 'Tandoori Special' },
    { id: 'a4', image: hero, title: 'Restaurant Interior' },
    { id: 'a5', image: heroBg, title: 'Ambiance' },
    { id: 'a6', image: logo, title: 'Royal Daawat Logo' },
  ]);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getGallery();
        if (response.data && response.data.length > 0) {
          const backendImages = response.data.map(img => ({
            ...img,
            image: img.image.startsWith('http') ? img.image : `http://localhost:5000/${img.image.replace(/\\/g, '/')}`
          }));
          setImages(prev => [...prev, ...backendImages]);
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
      }
    };
    fetchGallery();
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{ backgroundColor: '#d5cfc6', minHeight: '100vh', paddingTop: '110px', paddingBottom: '60px' }}
    >
      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 15px;
        }
        @media (max-width: 991px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 10px;
          }
        }
        @media (max-width: 575px) {
          .gallery-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 10px;
            padding: 10px;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="gallery-grid">
          {images.map((img, index) => (
            <GalleryCard 
              key={img.id || index} 
              image={img.image} 
              title={img.title} 
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.95)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              cursor: 'zoom-out'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={{
                maxWidth: '90%',
                maxHeight: '80vh',
                borderRadius: '8px',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.6)',
                display: 'flex'
              }}
            >
              <ImageWithFallback 
                src={selectedImg.image}
                alt={selectedImg.title}
                style={{ borderRadius: '8px', objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </motion.div>
            <h3 className="cinzel-font text-gold" style={{ marginTop: '2rem', fontSize: '1.5rem' }}>{selectedImg.title}</h3>
            <p style={{ color: '#fff', opacity: 0.7, marginTop: '10px' }}>Click anywhere to return</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
