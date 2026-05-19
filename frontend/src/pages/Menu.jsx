import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Phone, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { getMenu } from '../services/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const categoryOrder = [
  "Starters",
  "House Specials",
  "Tandoori Specials",
  "Biryani Dishes",
  "Curries",
  "Classic Dishes",
  "Rice",
  "Side Dishes",
  "Breads",
  "Drinks"
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const fetchMenu = async () => {
      try {
        const response = await getMenu();
        let flattenedMenu = [];
        let fetchedCategories = new Set();

        if (response.data && response.data.length > 0) {
          response.data.forEach(item => {
            if (item.availability !== false) { // Only show available items
              flattenedMenu.push({
                id: item._id,
                name: item.food_name,
                price: item.price,
                desc: item.description,
                category: item.category || 'Specials',
                dietary_preference: item.dietary_preference || 'Non Veg',
                rating: item.rating || 0
              });
              fetchedCategories.add(item.category || 'Specials');
            }
          });
        }

        // Sort categories according to the fixed order
        const sortedCats = Array.from(fetchedCategories).sort((a, b) => {
          const indexA = categoryOrder.indexOf(a);
          const indexB = categoryOrder.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        setMenuItems(flattenedMenu);
        setCategories(sortedCats);
        
        // Open "Starters" by default
        if (sortedCats.includes("Starters")) {
          setExpandedCategories({ "Starters": true });
        } else if (sortedCats.length > 0) {
          setExpandedCategories({ [sortedCats[0]]: true });
        }
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };
    
    fetchMenu();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Group items by category
  const groupedItems = {};
  menuItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <style>{`
        .category-header-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(212, 175, 55, 0.1);
          padding: 20px 30px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .category-header-btn:hover {
          background: rgba(212, 175, 55, 0.04);
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
        }
        .category-header-btn:hover .text-gold {
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }
        .menu-item-block {
          transition: all 0.25s ease;
          padding: 18px 25px;
          border-radius: 8px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }
        .menu-item-block:hover {
          background-color: rgba(212, 175, 55, 0.03);
        }
        .menu-item-block:hover .menu-item-title {
          color: var(--primary-color) !important;
        }
      `}</style>

      <section className="section-padding" style={{ backgroundColor: '#020508', minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="cinzel-font text-gold" style={{ fontSize: '3.5rem', letterSpacing: '2px', margin: 0 }}>DINE-IN MENU</h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '0.8rem auto' }}></div>
          </motion.div>

          {/* Accordion List of Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {categories.length > 0 ? (
              categories.map(categoryName => {
                const items = groupedItems[categoryName];
                if (!items || items.length === 0) return null;
                const isExpanded = !!expandedCategories[categoryName];

                return (
                  <div key={categoryName} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    {/* Collapsible Accordion Trigger Button */}
                    <button 
                      className="category-header-btn"
                      onClick={() => toggleCategory(categoryName)}
                    >
                      <span className="cinzel-font text-gold" style={{ fontSize: '1.8rem', letterSpacing: '1px', fontWeight: '600', textTransform: 'uppercase' }}>
                        {categoryName}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={24} color="var(--primary-color)" style={{ transition: 'transform 0.3s' }} />
                      ) : (
                        <ChevronDown size={24} color="var(--primary-color)" style={{ transition: 'transform 0.3s' }} />
                      )}
                    </button>

                    {/* Collapsible Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '0 0 12px 12px' }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '20px 10px', textAlign: 'center' }}>
                            {items.map(item => (
                              <div 
                                key={item.id} 
                                className="menu-item-block"
                                onClick={() => setShowCallPopup(true)}
                                title="Click to Order"
                              >
                                {/* Name and Price */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                  <h4 
                                    className="menu-item-title"
                                    style={{ 
                                      fontSize: '1.15rem', 
                                      fontWeight: 'bold', 
                                      color: '#fff', 
                                      letterSpacing: '1px', 
                                      textTransform: 'uppercase', 
                                      margin: 0,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      transition: 'color 0.2s ease'
                                    }}
                                  >
                                    {item.name} £{item.price}
                                  </h4>
                                  {item.dietary_preference === "Veg" && (
                                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', border: '1px solid #fff' }} title="Vegetarian"></span>
                                  )}
                                  {item.dietary_preference === "Non Veg" && (
                                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#f44336', borderRadius: '50%', border: '1px solid #fff' }} title="Non-Vegetarian"></span>
                                  )}
                                </div>
                                
                                {/* Description */}
                                {item.desc && (
                                  <p style={{ color: '#8892b0', fontSize: '0.95rem', lineHeight: 1.6, margin: '8px 0 0 0', fontWeight: '400' }}>
                                    {item.desc}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Loading menu...
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Link to="/book-table" className="btn btn-primary" style={{ padding: '15px 45px', fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}>Book a Table</Link>
          </div>

        </div>
      </section>

      {/* Floating Action / Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: 'var(--primary-color)',
            color: '#000',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 99,
            transition: 'all 0.3s ease'
          }}
          title="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Call to Order Popup */}
      <AnimatePresence>
        {showCallPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowCallPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: '#070f14', padding: '2.5rem', borderRadius: '15px', border: '1px solid var(--primary-color)', textAlign: 'center', maxWidth: '420px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            >
              <h2 className="cinzel-font text-gold" style={{ fontSize: '2.2rem', marginBottom: '0.8rem', letterSpacing: '1px' }}>ROYAL DAAWAT</h2>
              <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--primary-color)', margin: '0.5rem auto 1.5rem auto' }}></div>
              <p style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1.5rem' }}>Call us directly to place your order:</p>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(212, 175, 55, 0.08)', padding: '12px 25px', borderRadius: '30px', marginBottom: '1.5rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <Phone size={18} color="var(--primary-color)" />
                <span style={{ color: 'var(--primary-color)', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '1px' }}>+91 9876543210</span>
              </div>
              
              <div style={{ color: '#8892b0', marginBottom: '2rem', fontSize: '0.95rem' }}>
                <p style={{ margin: '4px 0' }}>Opening Hours:</p>
                <p style={{ margin: '4px 0', color: '#fff', fontWeight: 'bold' }}>10:00 AM - 11:00 PM</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a href="tel:+919876543210" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', padding: '12px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }} onClick={() => setShowCallPopup(false)}>Call Now</a>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '12px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }} onClick={() => setShowCallPopup(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Menu;


