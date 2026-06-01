import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createBooking, getSettings } from '../services/api';
import { Calendar, Phone } from 'lucide-react';

const BookTable = () => {
  const [formData, setFormData] = useState({
    site: 'Royal Daawat',
    guestCount: '',
    bookingDate: '',
    duration: '02:30',
    bookingTime: '',
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequest: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false);
  const [settings, setSettings] = useState({
    phoneNumber: '+01425 476563',
    openingHours: 'Monday – Sunday: 5 PM – 11 PM'
  });

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
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
        console.error("Failed to load settings in BookTable:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleWhatsAppFallback = () => {
    const message = encodeURIComponent(
      `*New Table Reservation Request - Royal Daawat*\n\n` +
      `- *Name:* ${formData.title} ${formData.firstName} ${formData.lastName}\n` +
      `- *Guests:* ${formData.guestCount}\n` +
      `- *Date:* ${formData.bookingDate}\n` +
      `- *Time:* ${formData.bookingTime}\n` +
      `- *Duration:* ${formData.duration}\n` +
      `- *Phone:* ${formData.phone}\n` +
      `- *Email:* ${formData.email}\n` +
      (formData.specialRequest ? `- *Notes:* ${formData.specialRequest}\n` : '') +
      `\nPlease confirm my reservation. Thank you!`
    );

    const rawPhone = settings.phoneNumber || '+441425476563';
    let cleanedPhone = rawPhone.replace(/\s+/g, '').replace(/\+/g, '');
    if (cleanedPhone.startsWith('0') && cleanedPhone.length === 11) {
      cleanedPhone = '44' + cleanedPhone.slice(1);
    }

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setShowWhatsAppFallback(false);

    // Validation
    if (!formData.guestCount || !formData.bookingDate || !formData.bookingTime || !formData.title || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }

    const phoneRegex = /^[0-9+\-\\s]{8,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    const selectedDate = new Date(formData.bookingDate);
    const currentDate = new Date(today);
    if (selectedDate < currentDate) {
      setError('Booking date cannot be in the past.');
      return;
    }

    setLoading(true);
    try {
      await createBooking(formData);
      setSuccess(true);
      setFormData({
        site: 'Royal Daawat', guestCount: '', bookingDate: '', duration: '02:30', bookingTime: '', title: 'Mr.', firstName: '', lastName: '', email: '', phone: '', specialRequest: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
      setShowWhatsAppFallback(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper styles matching Royal Daawat theme
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  };
  
  const labelStyle = {
    flex: '0 0 30%',
    fontSize: '0.95rem',
    color: '#fff',
    fontWeight: '500'
  };

  const inputStyle = {
    flex: '1',
    padding: '12px 15px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const asteriskStyle = {
    color: 'var(--primary-color)',
    marginLeft: '3px'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="section-padding" style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh', paddingTop: '150px' }}>
        <div className="container" style={{ maxWidth: '800px', display: 'flex', justifyContent: 'center' }}>
          
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', width: '100%', maxWidth: '700px', borderRadius: '15px', border: '1px solid rgba(212, 175, 55, 0.1)', overflow: 'hidden' }}>
            
            <div style={{ padding: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 className="cinzel-font text-gold" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Table Reservation</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: '1px' }}>
                  Reserve your royal dining experience with us.
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary-color)', marginBottom: '35px', fontSize: '0.9rem', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.3s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>
                <Calendar size={18} />
                <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>View our opening times</span>
              </div>

              {error && (
                <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', borderLeft: '4px solid #e74c3c', color: '#e74c3c', padding: '15px', borderRadius: '4px', marginBottom: '25px', fontSize: '0.95rem' }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{error}</p>
                  {showWhatsAppFallback && (
                    <div style={{ borderTop: '1px solid rgba(231, 76, 60, 0.2)', paddingTop: '10px', marginTop: '10px' }}>
                      <p style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.9rem' }}>You can instantly send your reservation details to us directly via WhatsApp instead:</p>
                      <button 
                        type="button" 
                        onClick={handleWhatsAppFallback}
                        className="btn"
                        style={{ backgroundColor: '#25D366', color: '#fff', padding: '10px 20px', fontSize: '0.9rem', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        Book via WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}
              {success && <div style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', borderLeft: '4px solid #2ecc71', color: '#2ecc71', padding: '15px', borderRadius: '4px', marginBottom: '25px', fontSize: '0.95rem' }}>Your reservation has been created successfully! We will contact you shortly to confirm.</div>}

              <form onSubmit={handleSubmit}>
                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Site<span style={asteriskStyle}>*</span></label>
                  <select className="reservation-input" name="site" value={formData.site} onChange={handleChange} style={inputStyle}>
                    <option value="Royal Daawat" style={{ backgroundColor: '#050a0f' }}>Royal Daawat</option>
                  </select>
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Guests<span style={asteriskStyle}>*</span></label>
                  <select className="reservation-input" name="guestCount" value={formData.guestCount} onChange={handleChange} required style={inputStyle}>
                    <option value="" style={{ backgroundColor: '#050a0f' }}>Please Select...</option>
                    {[...Array(20).keys()].map(i => (
                      <option key={i+1} value={i+1} style={{ backgroundColor: '#050a0f' }}>{i+1}</option>
                    ))}
                  </select>
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Date<span style={asteriskStyle}>*</span></label>
                  <input className="reservation-input" type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} min={today} required style={{...inputStyle, colorScheme: 'dark'}} />
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Duration<span style={asteriskStyle}>*</span></label>
                  <select className="reservation-input" name="duration" value={formData.duration} onChange={handleChange} required style={inputStyle}>
                    <option value="01:00" style={{ backgroundColor: '#050a0f' }}>01:00</option>
                    <option value="01:30" style={{ backgroundColor: '#050a0f' }}>01:30</option>
                    <option value="02:00" style={{ backgroundColor: '#050a0f' }}>02:00</option>
                    <option value="02:30" style={{ backgroundColor: '#050a0f' }}>02:30</option>
                    <option value="03:00" style={{ backgroundColor: '#050a0f' }}>03:00</option>
                  </select>
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Time<span style={asteriskStyle}>*</span></label>
                  <input className="reservation-input" type="time" name="bookingTime" value={formData.bookingTime} onChange={handleChange} required style={{...inputStyle, colorScheme: 'dark'}} />
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Title<span style={asteriskStyle}>*</span></label>
                  <select className="reservation-input" name="title" value={formData.title} onChange={handleChange} required style={{ ...inputStyle, flex: 'none', width: '150px' }}>
                    <option value="Mr." style={{ backgroundColor: '#050a0f' }}>Mr.</option>
                    <option value="Mrs." style={{ backgroundColor: '#050a0f' }}>Mrs.</option>
                    <option value="Miss" style={{ backgroundColor: '#050a0f' }}>Miss</option>
                    <option value="Ms." style={{ backgroundColor: '#050a0f' }}>Ms.</option>
                    <option value="Dr." style={{ backgroundColor: '#050a0f' }}>Dr.</option>
                  </select>
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>First name<span style={asteriskStyle}>*</span></label>
                  <input className="reservation-input" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={inputStyle} />
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Surname<span style={asteriskStyle}>*</span></label>
                  <input className="reservation-input" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={inputStyle} />
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Email<span style={asteriskStyle}>*</span></label>
                  <input className="reservation-input" type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                </div>

                <div className="reservation-row" style={rowStyle}>
                  <label className="reservation-label" style={labelStyle}>Telephone<span style={asteriskStyle}>*</span></label>
                  <input className="reservation-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />
                </div>

                <div className="reservation-row" style={{ ...rowStyle, alignItems: 'flex-start' }}>
                  <label className="reservation-label" style={{ ...labelStyle, marginTop: '12px' }}>Notes</label>
                  <textarea className="reservation-input" name="specialRequest" value={formData.specialRequest} onChange={handleChange} rows="3" style={inputStyle}></textarea>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', letterSpacing: '1px' }}>
                    {loading ? 'PROCESSING...' : 'CREATE RESERVATION'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>
    </motion.div>
  );
};

export default BookTable;
