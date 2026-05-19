import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import dish2 from '../assets/dish2.jpg';

const GiftCard = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const amounts = [25, 50, 100, 250];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: '#020508', minHeight: '100vh', paddingTop: '150px', paddingBottom: '80px' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3.5rem' }}>Gift Cards</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>GIVE THE GIFT OF ROYAL DINING</p>
        </div>

        <div style={{ 
          width: '100%', 
          height: '400px', 
          backgroundImage: `url(${dish2})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          borderRadius: '20px',
          marginBottom: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h3 className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Royal Daawat</h3>
            <p style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '4px' }}>EXCLUSIVELY YOURS</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {amounts.map((amount) => (
            <motion.div
              key={amount}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '3rem 2rem',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h4 className="cinzel-font" style={{ color: '#fff', fontSize: '1rem' }}>GIFT VOUCHER</h4>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>£{amount}</div>
              <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>PURCHASE</button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GiftCard;
