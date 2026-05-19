import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

const GalleryCard = ({ image, title, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '4/3',
        backgroundColor: '#ccc5b9'
      }}
    >
      <ImageWithFallback
        src={image}
        alt={title || "Gallery Image"}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      />
    </motion.div>
  );
};

export default GalleryCard;

