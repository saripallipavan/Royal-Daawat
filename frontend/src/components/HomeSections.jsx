import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, ChefHat, Zap, Gem, Heart, Clock, Phone, Mail, MapPin } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.2 } }
};

// 1) SIGNATURE DISHES SECTION
export const SignatureDishes = () => {
  const dishes = [
    { name: "Butter Chicken", price: "£14.95", desc: "Tender chicken in a rich, creamy tomato gravy.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800" },
    { name: "Hyderabadi Biryani", price: "£16.95", desc: "Fragrant basmati rice layered with spiced meat.", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800" },
    { name: "Paneer Tikka", price: "£12.95", desc: "Grilled cottage cheese marinated in Indian spices.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800" },
    { name: "Tandoori Chicken", price: "£13.95", desc: "Classic roasted chicken with smoky tandoor flavor.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800" },
    { name: "Assorted Kebabs", price: "£15.95", desc: "A selection of our finest minced meat kebabs.", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=800" },
    { name: "Royal Dessert", price: "£7.95", desc: "Traditional sweet dumplings in sugar syrup.", img: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section style={{ backgroundColor: 'var(--dark-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Signature Dishes</motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>EXPERIENCE OUR CHEF'S FINEST CREATIONS</motion.p>
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
                border: '1px solid rgba(212, 175, 55, 0.1)',
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
export const GalleryPreview = ({ images }) => {
  return (
    <section style={{ backgroundColor: 'var(--light-bg)', padding: '60px 0' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '15px'
        }}>
          {images.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              style={{ position: 'relative', height: '300px', overflow: 'hidden', borderRadius: '10px' }}
            >
              <ImageWithFallback src={img} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                backgroundColor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <Gem color="var(--primary-color)" size={30} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 3) WHY CHOOSE US SECTION
export const WhyChooseUs = () => {
  const reasons = [
    { icon: <Gem size={40} />, title: "Premium Quality", desc: "Authentic spices and top-tier meats." },
    { icon: <ChefHat size={40} />, title: "Master Chefs", desc: "Expertise in traditional Indian cuisine." },
    { icon: <Zap size={40} />, title: "Fast Service", desc: "Hot food delivered right to your table." },
    { icon: <Gem size={40} />, title: "Luxury Dining", desc: "Elegant ambiance for special moments." }
  ];

  return (
    <section style={{ backgroundColor: 'var(--dark-bg)', padding: '100px 0' }}>
      <div className="container">
        <div className="why-choose-us-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {reasons.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--primary-color)' }}
              className="why-choose-us-card"
              style={{
                padding: '3rem 2rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <h3 className="cinzel-font" style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4) SPECIAL OFFERS SECTION
import { useState, useEffect } from 'react';
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
            img: o.image ? (o.image.startsWith('http') ? o.image : `http://localhost:5000/${o.image.replace(/\\/g, '/')}`) : defaultOffers[0].img
          }));
          setOffers([...dynamicOffers, ...defaultOffers].slice(0, 3)); // show top 3
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOffers();
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
export const ChefRecommendations = () => {
  const recommendations = [
    { name: "Lamb Shank Rogan Josh", desc: "Slow-cooked lamb shank in a spicy, aromatic gravy.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" },
    { name: "Seafood Moilee", desc: "A mild Keralan fish curry with coconut milk and ginger.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <section style={{ backgroundColor: 'var(--dark-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Chef's Recommendations</h2>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>HANDPICKED FAVORITES BY OUR HEAD CHEF</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          {recommendations.map((rec, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02 }}
              className="chef-rec-card"
              style={{ flex: '1 1 500px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '25px', overflow: 'hidden', display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', flexWrap: 'wrap' }}
            >
              <div className="chef-rec-img-container" style={{ flex: '1 1 300px', height: '400px' }}>
                <ImageWithFallback src={rec.img} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div className="chef-rec-content" style={{ flex: '1 1 300px', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{rec.name}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>{rec.desc}</p>
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
    <section style={{ backgroundColor: 'var(--light-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3rem', marginBottom: '1rem' }}>What Our Guests Say</h2>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>REAL EXPERIENCES FROM OUR VALUED CUSTOMERS</p>
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
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '3rem',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                textAlign: 'center'
              }}
            >
              <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', border: '2px solid var(--primary-color)', overflow: 'hidden' }}>
                <ImageWithFallback src={rev.img} alt={rev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill={idx < rev.rating ? "var(--primary-color)" : "transparent"} />)}
              </div>
              <p style={{ color: '#fff', fontStyle: 'italic', marginBottom: '2rem', lineHeight: '1.6' }}>"{rev.text}"</p>
              <h4 className="cinzel-font text-gold" style={{ fontSize: '1.1rem' }}>{rev.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7) EXPERIENCE SECTION
export const Experience = () => {
  return (
    <section style={{ 
      height: '600px', 
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
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)' }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cinzel-font text-gold" style={{ fontSize: '4rem', marginBottom: '2rem' }}
        >
          Experience Royal Dining
        </motion.h2>
        <p style={{ color: '#fff', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: '1.8' }}>
          Immerse yourself in an atmosphere of luxury and tradition. Every detail, from our decor to our service, is designed to make you feel like royalty.
        </p>
        <Link to="/contact" className="btn btn-primary" style={{ padding: '15px 50px' }}>BOOK AN EXPERIENCE</Link>
      </div>
    </section>
  );
};

// 8) CONTACT PREVIEW SECTION
export const ContactPreview = () => {
  return (
    <section style={{ backgroundColor: 'var(--dark-bg)', padding: '100px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          
          <div style={{ textAlign: 'center' }}>
            <Clock color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font text-gold" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Opening Hours</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Monday – Sunday<br />
              05:00 PM – 11:00 PM
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Phone color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font text-gold" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Phone</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              +01425 476563
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Mail color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font text-gold" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Email</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              info@royaldaawat.co.uk
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <MapPin color="var(--primary-color)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 className="cinzel-font text-gold" style={{ fontSize: '1.5rem', marginBottom: '1.2rem' }}>Address</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              14 Market Pl,<br />
              Ringwood BH24 1AW
            </p>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Link to="/contact" className="btn btn-primary" style={{ padding: '15px 60px' }}>BOOK A TABLE NOW</Link>
        </div>
      </div>
    </section>
  );
};
