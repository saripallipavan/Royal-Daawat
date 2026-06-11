import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Phone, ArrowUp, ChevronDown, ChevronUp, ShoppingBag, Plus, Minus, X, Search } from 'lucide-react';
import { getMenu, getSettings } from '../services/api';
import fallbackMenu from '../data/fallbackMenu.json';

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

const getInitialMenuData = () => {
  let flattenedMenu = [];
  let fetchedCategories = new Set();
  
  fallbackMenu.forEach(item => {
    if (item.availability !== false) {
      const itemId = item.id || item._id || Math.random().toString();
      const itemName = item.name || item.food_name || '';
      const itemPrice = parseFloat(item.price) || 0;
      const itemDesc = item.desc || item.description || '';
      const itemCat = item.category || 'Specials';
      const itemDiet = item.dietary_preference || 'Non Veg';
      const itemRating = item.rating || 0;

      flattenedMenu.push({
        id: itemId,
        name: itemName,
        price: itemPrice,
        desc: itemDesc,
        category: itemCat,
        dietary_preference: itemDiet,
        rating: itemRating
      });
      fetchedCategories.add(itemCat);
    }
  });

  const sortedCats = Array.from(fetchedCategories).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return { flattenedMenu, sortedCats };
};

const Menu = () => {
  const initialData = getInitialMenuData();
  const [menuItems, setMenuItems] = useState(initialData.flattenedMenu);
  const [categories, setCategories] = useState(initialData.sortedCats);
  const [isLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(
    initialData.sortedCats.includes("Starters") ? { "Starters": true } : (initialData.sortedCats.length > 0 ? { [initialData.sortedCats[0]]: true } : {})
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  // Cart and Online Ordering States
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [orderType, setOrderType] = useState('Pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [settings, setSettings] = useState({
    phoneNumber: '+01425 476563',
    openingHours: 'Monday – Sunday: 5 PM – 11 PM'
  });

  const fetchMenu = async () => {
    try {
      const response = await getMenu();
      if (response.data && response.data.length > 0) {
        const data = response.data;
        let flattenedMenu = [];
        let fetchedCategories = new Set();

        data.forEach(item => {
          if (item.availability !== false) {
            const itemId = item.id || item._id || Math.random().toString();
            const itemName = item.name || item.food_name || '';
            const itemPrice = parseFloat(item.price) || 0;
            const itemDesc = item.desc || item.description || '';
            const itemCat = item.category || 'Specials';
            const itemDiet = item.dietary_preference || 'Non Veg';
            const itemRating = item.rating || 0;

            flattenedMenu.push({
              id: itemId,
              name: itemName,
              price: itemPrice,
              desc: itemDesc,
              category: itemCat,
              dietary_preference: itemDiet,
              rating: itemRating
            });
            fetchedCategories.add(itemCat);
          }
        });

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
      }
    } catch (apiErr) {
      console.warn("Failed to fetch menu from backend API in background, keeping local data:", apiErr);
      setError("Failed to load backend menu items. Displaying offline fallback menu.");
    }
  };

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
    
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        if (data) {
          setSettings(prev => ({
            ...prev,
            phoneNumber: data.phoneNumber || prev.phoneNumber,
            openingHours: data.openingHours || prev.openingHours
          }));
        }
      } catch (err) {
        console.error("Failed to load settings in Menu:", err);
      }
    };

    fetchMenu();
    fetchSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Helper Logics
  const addToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === item.id);
      if (existing) {
        return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(i => i.id !== itemId));
    } else {
      setCart(prevCart => prevCart.map(i => i.id === itemId ? { ...i, quantity } : i));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Please fill in your Name and Phone Number.");
      return;
    }
    if (orderType === 'Delivery' && !customerAddress.trim()) {
      alert("Please enter a Delivery Address.");
      return;
    }

    let itemsText = '';
    cart.forEach((item, index) => {
      itemsText += `${index + 1}. *${item.name}* (x${item.quantity}) - £${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const totalText = `*Total Amount:* £${getCartTotal().toFixed(2)}`;
    const detailsText = `*Customer Details:*\n- Name: ${customerName}\n- Phone: ${customerPhone}\n- Type: ${orderType}${orderType === 'Delivery' ? `\n- Address: ${customerAddress}` : ''}`;
    
    const message = encodeURIComponent(
      `*New Online Order - Royal Daawat*\n\n` +
      `*Items Ordered:*\n${itemsText}\n` +
      `${totalText}\n\n` +
      `${detailsText}\n\n` +
      `Please confirm my order. Thank you!`
    );

    const rawPhone = settings.phoneNumber || '+441425476563';
    let cleanedPhone = rawPhone.replace(/\s+/g, '').replace(/\+/g, '');
    if (cleanedPhone.startsWith('0') && cleanedPhone.length === 11) {
      cleanedPhone = '44' + cleanedPhone.slice(1);
    }

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setShowCartModal(false);
    alert("Thank you! Your order has been generated. Opening WhatsApp to complete your order...");
  };

  // Filter items by search query
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          border: 1px solid rgba(182, 162, 94, 0.1);
          padding: 20px 30px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .category-header-btn:hover {
          background: rgba(182, 162, 94, 0.04);
          border-color: rgba(182, 162, 94, 0.3);
          transform: translateY(-2px);
        }
        .category-header-btn:hover .text-gold {
          text-shadow: 0 0 10px rgba(182, 162, 94, 0.3);
        }
        .menu-item-block {
          transition: all 0.25s ease;
          padding: 18px 25px;
          border-radius: 8px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }
        .menu-item-block:hover {
          background-color: rgba(182, 162, 94, 0.03);
        }
        .menu-item-block:hover .menu-item-title {
          color: var(--primary-color) !important;
        }
        .btn-add-to-cart {
          background-color: transparent !important;
          color: var(--primary-color) !important;
          border: 1px solid var(--primary-color) !important;
          border-radius: 20px !important;
          padding: 6px 14px !important;
          font-size: 0.8rem !important;
          font-weight: bold !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          white-space: nowrap !important;
        }
        .btn-add-to-cart:hover {
          background-color: var(--primary-color) !important;
          color: var(--dark-bg) !important;
          box-shadow: 0 0 10px rgba(182, 162, 94, 0.4) !important;
        }
      `}</style>

      <section className="section-padding" style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="cinzel-font text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '2px', margin: 0 }}>MENU & ORDER ONLINE</h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '0.8rem auto' }}></div>
          </motion.div>

          {/* Search Bar Container */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '3rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
            }}>
              <input
                type="text"
                placeholder="Search for your favorite food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 45px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(182, 162, 94, 0.2)',
                  borderRadius: '30px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 15px rgba(182, 162, 94, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(182, 162, 94, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Search 
                size={18} 
                color="var(--primary-color)" 
                style={{
                  position: 'absolute',
                  left: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '18px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Accordion List of Categories or Search Results */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(182, 162, 94, 0.1)', borderTop: '3px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>Preparing our royal menu...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'rgba(244, 67, 54, 0.05)', border: '1px solid rgba(244, 67, 54, 0.2)', borderRadius: '12px', color: '#ff6b6b' }}>
              <p style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>{error}</p>
              <button 
                onClick={() => fetchMenu()}
                className="btn btn-primary" 
                style={{ padding: '10px 30px', fontSize: '0.95rem', borderRadius: '30px', fontWeight: 'bold' }}
              >
                Try Again
              </button>
            </div>
          ) : searchQuery ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', letterSpacing: '1px', textAlign: 'center', marginBottom: '1rem' }}>
                Search Results ({filteredMenuItems.length})
              </h3>
              {filteredMenuItems.length > 0 ? (
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '12px', padding: '10px', border: '1px solid rgba(182, 162, 94, 0.1)' }}>
                  {filteredMenuItems.map(item => (
                    <div 
                      key={item.id} 
                      className="menu-item-block"
                      onClick={() => setSelectedFood(item)}
                      title="Click to view details"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
                    >
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        {/* Name and Price */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
                            {item.name} £{item.price.toFixed(2)}
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

                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                        className="btn-add-to-cart"
                      >
                        ADD +
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Inter, sans-serif' }}>
                  No food items found matching "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '20px 10px' }}>
                              {items.map(item => (
                                <div 
                                  key={item.id} 
                                  className="menu-item-block"
                                  onClick={() => setSelectedFood(item)}
                                  title="Click to view details"
                                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
                                >
                                  <div style={{ flex: 1, textAlign: 'left' }}>
                                    {/* Name and Price */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
                                        {item.name} £{item.price.toFixed(2)}
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

                                  <button 
                                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                    className="btn-add-to-cart"
                                  >
                                    ADD +
                                  </button>
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
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                  No menu items found. Please check back later.
                </div>
              )}
            </div>
          )}
          
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

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCartModal(true)}
          style={{
            position: 'fixed',
            bottom: showScrollTop ? '90px' : '30px',
            right: '30px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--dark-bg)',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(182, 162, 94, 0.4)',
            zIndex: 998,
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            fontFamily: 'Inter, sans-serif'
          }}
          className="floating-cart-btn"
        >
          <ShoppingBag size={20} />
          <span>View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          <span style={{ borderLeft: '1px solid rgba(11, 46, 31, 0.3)', paddingLeft: '10px' }}>£{getCartTotal().toFixed(2)}</span>
        </button>
      )}

      {/* Shopping Cart Sliding Drawer */}
      <AnimatePresence>
        {showCartModal && (
          <div 
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 99999,
              display: 'flex', justifyContent: 'flex-end'
            }}
            onClick={() => setShowCartModal(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%', maxWidth: '450px', height: '100vh',
                backgroundColor: 'var(--dark-bg)', borderLeft: '1px solid rgba(182, 162, 94, 0.15)',
                padding: '2rem', display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.6)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(182, 162, 94, 0.1)', paddingBottom: '1rem' }}>
                <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', margin: 0 }}>Your Order</h3>
                <button onClick={() => setShowCartModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '5px', marginBottom: '1rem' }}>
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(182, 162, 94, 0.05)' }}>
                      <div style={{ flex: 1, marginRight: '10px' }}>
                        <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 4px 0', fontWeight: '600' }}>{item.name}</h4>
                        <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 'bold' }}>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '26px', height: '26px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ color: '#fff', fontWeight: 'bold', minWidth: '15px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '26px', height: '26px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Your cart is empty.</div>
                )}
              </div>

              {/* Call Banner */}
              <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem 0', padding: '12px', backgroundColor: 'rgba(182, 162, 94, 0.05)', borderRadius: '8px', border: '1px dashed rgba(182, 162, 94, 0.2)' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prefer to order by phone?</p>
                <a href={`tel:${settings.phoneNumber}`} style={{ color: 'var(--primary-color)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', textDecoration: 'none' }}>
                  <Phone size={14} /> Call: {settings.phoneNumber}
                </a>
              </div>

              {/* Checkout Form */}
              <div style={{ borderTop: '1px solid rgba(182, 162, 94, 0.15)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => setOrderType('Pickup')}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                      backgroundColor: orderType === 'Pickup' ? 'var(--primary-color)' : 'rgba(255,255,255,0.02)',
                      color: orderType === 'Pickup' ? 'var(--dark-bg)' : '#fff',
                      border: orderType === 'Pickup' ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    Pickup
                  </button>
                  <button 
                    onClick={() => setOrderType('Delivery')}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                      backgroundColor: orderType === 'Delivery' ? 'var(--primary-color)' : 'rgba(255,255,255,0.02)',
                      color: orderType === 'Delivery' ? 'var(--dark-bg)' : '#fff',
                      border: orderType === 'Delivery' ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    Delivery
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                  <input 
                    type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required 
                    style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px' }}
                  />
                  <input 
                    type="tel" placeholder="Your Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required 
                    style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px' }}
                  />
                  {orderType === 'Delivery' && (
                    <textarea 
                      placeholder="Delivery Address" rows="2" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required
                      style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', resize: 'none' }}
                    />
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>£{getCartTotal().toFixed(2)}</span>
                </div>

                <button 
                  onClick={placeOrder}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}
                >
                  PLACE ORDER VIA WHATSAPP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(182, 162, 94, 0.08)', padding: '12px 25px', borderRadius: '30px', marginBottom: '1.5rem', border: '1px solid rgba(182, 162, 94, 0.2)' }}>
                <Phone size={18} color="var(--primary-color)" />
                <span style={{ color: 'var(--primary-color)', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '1px' }}>{settings.phoneNumber}</span>
              </div>
              
              <div style={{ color: '#8892b0', marginBottom: '2rem', fontSize: '0.95rem' }}>
                <p style={{ margin: '4px 0' }}>Opening Hours:</p>
                <p style={{ margin: '4px 0', color: '#fff', fontWeight: 'bold' }}>{settings.openingHours}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <a href={`tel:${settings.phoneNumber}`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', padding: '12px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }} onClick={() => setShowCallPopup(false)}>Call Now</a>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '12px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }} onClick={() => setShowCallPopup(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Details Modal */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#0F3D2A',
                padding: '2.5rem',
                borderRadius: '16px',
                border: '1px solid var(--primary-color)',
                width: '100%',
                maxWidth: '550px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.8), 0 0 35px rgba(182, 162, 94, 0.15)',
                position: 'relative',
                textAlign: 'left'
              }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedFood(null)} 
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.7)', 
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                <X size={24} />
              </button>

              {/* Category Badge */}
              <span style={{ 
                fontSize: '0.85rem', 
                textTransform: 'uppercase', 
                color: 'var(--primary-color)', 
                fontWeight: 'bold', 
                letterSpacing: '2px', 
                display: 'block', 
                marginBottom: '0.8rem' 
              }}>
                {selectedFood.category}
              </span>

              {/* Title & Preference badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '15px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h3 className="cinzel-font text-gold" style={{ fontSize: '2.2rem', margin: 0, lineHeight: 1.2 }}>
                  {selectedFood.name}
                </h3>
                
                {/* Dietary preference badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '10px', 
                    height: '10px', 
                    backgroundColor: selectedFood.dietary_preference === "Veg" ? '#4caf50' : '#f44336', 
                    borderRadius: '50%',
                    boxShadow: selectedFood.dietary_preference === "Veg" ? '0 0 8px #4caf50' : '0 0 8px #f44336'
                  }}></span>
                  <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {selectedFood.dietary_preference === "Veg" ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                £{selectedFood.price.toFixed(2)}
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(182, 162, 94, 0.15)', marginBottom: '1.5rem' }}></div>

              {/* Description */}
              <p style={{ 
                color: '#D8D8D8', 
                fontSize: '1.05rem', 
                lineHeight: 1.7, 
                marginBottom: '2rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {selectedFood.desc || "No description available for this item. Crafted with authentic Indian spices and premium ingredients."}
              </p>

              {/* Extra Info */}
              <div style={{ 
                backgroundColor: 'rgba(0,0,0,0.15)', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontFamily: 'Inter, sans-serif'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Preparation Time:</span>
                  <span style={{ color: '#fff', fontWeight: '500' }}>15 - 20 minutes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Allergen Information:</span>
                  <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Gluten, Dairy (varies)</span>
                </div>
                {selectedFood.rating > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Rating:</span>
                    <span style={{ display: 'flex', gap: '3px', alignItems: 'center', color: 'var(--primary-color)' }}>
                      <Star size={14} fill="var(--primary-color)" />
                      <span style={{ color: '#fff', fontWeight: 'bold', marginLeft: '3px' }}>{selectedFood.rating}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={() => {
                    addToCart(selectedFood);
                    setSelectedFood(null);
                  }}
                  className="btn btn-primary"
                  style={{ 
                    flex: 2, 
                    padding: '14px 0', 
                    fontSize: '0.95rem', 
                    letterSpacing: '1px', 
                    textTransform: 'uppercase', 
                    fontFamily: 'Cinzel, serif',
                    fontWeight: 'bold'
                  }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="btn btn-secondary"
                  style={{ 
                    flex: 1, 
                    padding: '14px 0', 
                    fontSize: '0.95rem', 
                    letterSpacing: '1px', 
                    textTransform: 'uppercase', 
                    fontFamily: 'Cinzel, serif'
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Menu;


