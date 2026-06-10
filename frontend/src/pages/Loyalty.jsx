import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Gift, UserPlus } from 'lucide-react';

const Loyalty = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const benefits = [
    { icon: <Award size={40} />, title: "Earn Points", desc: "Get 1 point for every £1 spent on dining or takeaway." },
    { icon: <Zap size={40} />, title: "Exclusive Offers", desc: "Unlock special discounts and seasonal promotions." },
    { icon: <Gift size={40} />, title: "Birthday Rewards", desc: "Celebrate your special day with a royal treat from us." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: '#020508', minHeight: '100vh', paddingTop: '150px', paddingBottom: '80px' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Loyalty Points</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>REWARDING YOUR ROYAL TASTE</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '5rem' }}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid rgba(182, 162, 94, 0.1)',
                textAlign: 'center'
              }}
            >
              <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                {benefit.icon}
              </div>
              <h3 className="cinzel-font" style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>{benefit.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ 
          backgroundColor: 'rgba(182, 162, 94, 0.05)', 
          padding: '4rem', 
          borderRadius: '30px', 
          border: '1px solid rgba(182, 162, 94, 0.2)',
          textAlign: 'center'
        }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Join the Royal Circle</h2>
          <p style={{ color: '#fff', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: '1.8' }}>
            Sign up today and start earning points on every visit. Redeem your points for free appetizers, desserts, or even full meals!
          </p>
          <button className="btn btn-primary" style={{ padding: '15px 50px', fontSize: '1rem' }}>
            <UserPlus size={18} style={{ marginRight: '10px' }} /> JOIN NOW
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Loyalty;
