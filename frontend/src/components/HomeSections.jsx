import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Zap, Heart, Clock, Phone, Mail, MapPin } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { getImageUrl } from '../services/api';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// 1) SIGNATURE DISHES SECTION
export const SignatureDishes = ({ settings }) => {
  const defaultDishes = [
    { name: "Butter Chicken", price: "£14.95", desc: "Tender chicken in a rich, creamy tomato gravy.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800" },
    { name: "Hyderabadi Biryani", price: "£16.95", desc: "Fragrant basmati rice layered with spiced meat.", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800" },
    { name: "Paneer Tikka", price: "£12.95", desc: "Grilled cottage cheese marinated in Indian spices.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800" }
  ];

  const dishes = (settings?.signatureDishes && settings.signatureDishes.length === 3 && settings.signatureDishes.every(d => d.name))
    ? settings.signatureDishes.map((d, idx) => ({
        name: d.name,
        price: d.price,
        desc: d.desc,
        img: getImageUrl(d.img) || defaultDishes[idx].img
      }))
    : defaultDishes;

  return (
    <section style={{ backgroundColor: 'var(--dark-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Signature Dishes</motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>AUTHENTIC INDIAN FINE DINING</motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {dishes.map((dish, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="signature-dish-card"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid rgba(182, 162, 94, 0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div className="signature-dish-img-container" style={{ height: '250px', overflow: 'hidden' }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ImageWithFallback 
                    src={dish.img} 
                    alt={dish.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    loading="lazy"
                  />
                </motion.div>
              </div>
              <div className="signature-dish-content" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--primary-color)" />)}
                </div>
                <h3 className="cinzel-font" style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{dish.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{dish.desc}</p>
                <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>{dish.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 2) GALLERY PREVIEW SECTION
export const GalleryPreview = ({ images, settings }) => {
  const defaultSlides = [
    {
      title: "Aromatic Dum Biryani",
      subtitle: "SIGNATURE FEAST",
      desc: "Fragrant, long-grain basmati rice layered with tender meat, infused with saffron and cooked to perfection under a traditional dum cover.",
      img: images[0]
    },
    {
      title: "Sizzling Kebab Platter",
      subtitle: "GOURMET GRILL",
      desc: "Perfectly seasoned, succulent skewers grilled over open embers, locking in rich, smoky flavors and tender juices.",
      img: images[1]
    },
    {
      title: "Royal Refreshments",
      subtitle: "SIGNATURE SIPS",
      desc: "Exquisite mocktails and handcrafted drinks, carefully blended with fresh botanicals, citrus, and aromatic spices to complement your meal.",
      img: images[2]
    }
  ];

  const slides = (settings?.galleryPreviewSlides && settings.galleryPreviewSlides.length === 3 && settings.galleryPreviewSlides.every(s => s.title))
    ? settings.galleryPreviewSlides.map((s, i) => ({
        title: s.title,
        subtitle: s.subtitle,
        desc: s.desc,
        img: getImageUrl(s.img) || defaultSlides[i].img
      }))
    : defaultSlides;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const timerRef = React.useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
  };

  React.useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    resetTimer();
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  };

  return (
    <section style={{ backgroundColor: 'var(--light-bg)', padding: '100px 0', overflow: 'hidden', position: 'relative' }}>
      {/* Background ambient glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(182, 162, 94, 0.05) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(182, 162, 94, 0.05) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="alex-brush-font" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', display: 'block', marginBottom: '0.5rem' }}>Our Gallery</span>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '2px' }}>Visual Culinary Journey</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '0 auto' }}></div>
        </div>

        {/* Main Slider Container */}
        <div className="gallery-slider-wrapper">
          {/* Left Column: Animated Image */}
          <div style={{ position: 'relative', overflow: 'hidden', height: '100%', minHeight: '350px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              >
                <ImageWithFallback
                  src={slides[activeIndex].img}
                  alt={slides[activeIndex].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Image Overlay */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'linear-gradient(to right, rgba(4, 16, 12, 0.2) 0%, rgba(4, 16, 12, 0.7) 100%)'
                }} />
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls (arrows) overlay on image */}
            <div style={{
              position: 'absolute', bottom: '30px', left: '30px', display: 'flex', gap: '15px', zIndex: 20
            }}>
              <button
                onClick={prevSlide}
                style={{
                  width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--primary-color)',
                  backgroundColor: 'rgba(4, 16, 12, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary-color)', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(4, 16, 12, 0.6)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                aria-label="Previous image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                style={{
                  width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--primary-color)',
                  backgroundColor: 'rgba(4, 16, 12, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary-color)', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-color)'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(4, 16, 12, 0.6)'; e.currentTarget.style.color = 'var(--primary-color)'; }}
                aria-label="Next image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Content card */}
          <div style={{
            padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            backgroundColor: '#04100c'
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <span className="cinzel-font" style={{
                  color: 'var(--primary-color)', fontSize: '0.9rem', letterSpacing: '4px',
                  fontWeight: 600, marginBottom: '1rem', display: 'block'
                }}>
                  {slides[activeIndex].subtitle}
                </span>
                
                <h3 className="cinzel-font" style={{
                  color: '#ffffff', fontSize: '2.5rem', fontWeight: 700,
                  marginBottom: '1.5rem', lineHeight: '1.2'
                }}>
                  {slides[activeIndex].title}
                </h3>
                
                <div style={{ width: '50px', height: '2px', backgroundColor: 'var(--primary-color)', marginBottom: '2rem' }}></div>
                
                <p style={{
                  color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8',
                  marginBottom: '2.5rem'
                }}>
                  {slides[activeIndex].desc}
                </p>

                {/* Pagination indicator */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      style={{
                        width: activeIndex === i ? '30px' : '10px',
                        height: '10px',
                        borderRadius: '5px',
                        backgroundColor: activeIndex === i ? 'var(--primary-color)' : 'rgba(182, 162, 94, 0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};


// 4) SPECIAL OFFERS SECTION
import { getOffers } from '../services/api';

export const SpecialOffers = () => {
  const defaultOffers = [
    { title: "Weekend Special", badge: "20% OFF", desc: "Enjoy a royal feast every Saturday and Sunday.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" },
    { title: "Family Combo", badge: "FREE DRINKS", desc: "Order for 4 or more and get complimentary beverages.", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" },
    { title: "Festival Offer", badge: "BUY 1 GET 1", desc: "Special offer on all Tandoori items this week.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" }
  ];

  const [offers, setOffers] = useState(defaultOffers);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getOffers();
        if (response.data && response.data.length > 0) {
          const dynamicOffers = response.data.map(o => ({
            title: o.title,
            badge: `${o.discount_percentage}% OFF`,
            desc: o.description,
            img: getImageUrl(o.image) || defaultOffers[0].img
          }));
          setOffers([...dynamicOffers, ...defaultOffers].slice(0, 3)); // show top 3
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section style={{ backgroundColor: 'var(--light-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Today's Special Offers</h2>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>DON'T MISS OUT ON OUR EXCLUSIVE DEALS</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {offers.map((offer, i) => (
            <div key={i} className="special-offer-card" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '450px' }}>
              <ImageWithFallback src={offer.img} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
              <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'var(--primary-color)', color: '#000', padding: '5px 15px', borderRadius: '5px', fontWeight: 'bold' }}>{offer.badge}</div>
              <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px' }}>
                <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{offer.title}</h3>
                <p style={{ color: '#fff', opacity: 0.8, marginBottom: '2rem' }}>{offer.desc}</p>
                <button className="btn btn-primary" onClick={() => navigate('/menu')} style={{ width: '100%' }}>CLAIM OFFER</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5) CHEF RECOMMENDATION SECTION
export const ChefRecommendations = ({ settings }) => {
  const defaultRecs = [
    { name: "Lamb Shank Rogan Josh", desc: "Slow-cooked lamb shank in a spicy, aromatic gravy.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" },
    { name: "Seafood Moilee", desc: "A mild Keralan fish curry with coconut milk and ginger.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" }
  ];

  const recommendations = (settings?.chefRecommendations && settings.chefRecommendations.length === 2 && settings.chefRecommendations.every(r => r.name))
    ? settings.chefRecommendations.map((r, idx) => ({
        name: r.name,
        desc: r.desc,
        img: getImageUrl(r.img) || defaultRecs[idx].img
      }))
    : defaultRecs;

  return (
    <section style={{ backgroundColor: 'var(--light-linen-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--dark-charcoal-text)' }}>Chef's Recommendations</h2>
          <p style={{ color: 'var(--muted-charcoal-text)', letterSpacing: '2px' }}>HANDPICKED FAVORITES BY OUR HEAD CHEF</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          {recommendations.map((rec, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}
              className="chef-rec-card"
              style={{ 
                flex: '1 1 500px', 
                backgroundColor: '#ffffff', 
                borderRadius: '25px', 
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', 
                flexWrap: 'wrap',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="chef-rec-img-container" style={{ flex: '1 1 300px', height: '400px' }}>
                <ImageWithFallback src={rec.img} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div className="chef-rec-content" style={{ flex: '1 1 300px', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="cinzel-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--dark-charcoal-text)' }}>{rec.name}</h3>
                <p style={{ color: 'var(--muted-charcoal-text)', lineHeight: '1.8', marginBottom: '2rem' }}>{rec.desc}</p>
                <Link to="/menu" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '2px' }}>DISCOVER MORE →</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6) CUSTOMER TESTIMONIALS SECTION
export const Testimonials = () => {
  const reviews = [
    { name: "John Doe", rating: 5, text: "The best Indian food I've ever had. The Butter Chicken is to die for!", img: "https://i.pravatar.cc/150?u=1" },
    { name: "Sarah Smith", rating: 5, text: "Amazing service and beautiful atmosphere. Highly recommend for special occasions.", img: "https://i.pravatar.cc/150?u=2" },
    { name: "Michael Brown", rating: 4, text: "Authentic flavors and very generous portions. Will definitely be back.", img: "https://i.pravatar.cc/150?u=3" }
  ];

  return (
    <section style={{ backgroundColor: 'var(--light-linen-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--dark-charcoal-text)' }}>What Our Guests Say</h2>
          <p style={{ color: 'var(--muted-charcoal-text)', letterSpacing: '2px' }}>REAL EXPERIENCES FROM OUR VALUED CUSTOMERS</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="testimonial-card"
              style={{
                backgroundColor: 'rgba(0,0,0,0.03)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                textAlign: 'center'
              }}
            >
              <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', border: '2px solid var(--primary-color)', overflow: 'hidden' }}>
                <ImageWithFallback src={rev.img} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill={idx < rev.rating ? "var(--primary-color)" : "transparent"} />)}
              </div>
              <p style={{ color: 'var(--dark-charcoal-text)', fontStyle: 'italic', marginBottom: '2rem', lineHeight: '1.6' }}>"{rev.text}"</p>
              <h4 className="cinzel-font" style={{ fontSize: '1.1rem', color: 'var(--dark-charcoal-text)' }}>{rev.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7) EXPERIENCE SECTION
export const Experience = () => {
  const reasons = [
    { 
      icon: <Star size={40} />, 
      title: "Loyalty Rewards", 
      desc: "Earn stamps on app or website orders. Collect 5 stamps and receive a £5 voucher." 
    },
    { 
      icon: <Zap size={40} />, 
      title: "Fast Delivery", 
      desc: "QUICK AND EASY ON THE GO ORDERING, WE AIM TO DELIVER WITHIN 45 MINUTES" 
    },
    { 
      icon: <Heart size={40} />, 
      title: "Fine Dining Atmosphere", 
      desc: "Sleek and modern contemporary surroundings tailored for special dining moments." 
    }
  ];

  return (
    <section style={{ 
      minHeight: '600px', 
      padding: '100px 0',
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600)', 
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
        zIndex: -1
      }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(11, 46, 31, 0.93)' }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Section Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cinzel-font text-gold" 
          style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.2rem)', 
            marginBottom: '3.5rem', 
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--primary-color)'
          }}
        >
          Royal Dining Experience
        </motion.h2>

        <div className="experience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', width: '100%' }}>
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: '#152d21', borderColor: 'var(--primary-color)', y: -10 }}
              className="why-choose-us-card"
              style={{
                padding: '3rem 2rem',
                backgroundColor: '#112219',
                borderRadius: '12px',
                border: '1px solid rgba(182, 162, 94, 0.15)',
                textAlign: 'center',
                transition: 'all 0.3s ease, y 0.3s ease'
              }}
            >
              <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <h3 className="cinzel-font" style={{ color: 'var(--primary-color)', fontSize: '1.3rem', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.title}</h3>
              <p className="cinzel-font" style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: '1.6', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 8) CONTACT PREVIEW SECTION
export const ContactPreview = ({ settings }) => {
  return (
    <section style={{ backgroundColor: 'var(--light-linen-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          
          <div style={{ textAlign: 'center' }}>
            <Clock color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font" style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: 'var(--dark-charcoal-text)' }}>Opening Hours</h3>
            <p style={{ color: 'var(--muted-charcoal-text)', lineHeight: '1.8' }}>
              {settings?.openingHours || (
                <>
                  Monday – Sunday<br />
                  05:00 PM – 11:00 PM
                </>
              )}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Phone color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font" style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: 'var(--dark-charcoal-text)' }}>Phone</h3>
            <p style={{ color: 'var(--muted-charcoal-text)', lineHeight: '1.8' }}>
              {settings?.phoneNumber || "+01425 476563"}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Mail color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font" style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: 'var(--dark-charcoal-text)' }}>Email</h3>
            <p style={{ color: 'var(--muted-charcoal-text)', lineHeight: '1.8' }}>
              info@royaldaawat.co.uk
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <MapPin color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font" style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: 'var(--dark-charcoal-text)' }}>Address</h3>
            <p style={{ color: 'var(--muted-charcoal-text)', lineHeight: '1.8' }}>
              {settings?.address || (
                <>
                  14 Market Pl,<br />
                  Ringwood BH24 1AW
                </>
              )}
            </p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          {settings?.tableReservationsUrl ? (
            <a 
              href={settings.tableReservationsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary" 
              style={{ padding: '15px 60px', textDecoration: 'none', display: 'inline-block' }}
            >
              BOOK A TABLE NOW
            </a>
          ) : (
            <Link to="/book-table" className="btn btn-primary" style={{ padding: '15px 60px' }}>BOOK A TABLE NOW</Link>
          )}
        </div>
      </div>
    </section>
  );
};
