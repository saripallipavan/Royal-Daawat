import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { postContact, getSettings } from '../services/api';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapWrapper from '../components/MapWrapper';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    restaurantName: 'Royal Daawat',
    phoneNumber: '+01425 476563',
    address: '14 Market Pl, Ringwood BH24 1AW',
    openingHours: 'Monday – Sunday: 5 PM – 11 PM',
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2516.3268800985556!2d-1.7946950232497645!3d50.84351336154673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4873998f804597b9%3A0xe53bcbeab7d73010!2s14%20Market%20Pl%2C%20Ringwood%20BH24%201AW%2C%20UK!5e0!3m2!1sen!2sus!4v1715844857416!5m2!1sen!2sus'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        if (data) {
          setSettings({
            restaurantName: data.restaurantName || 'Royal Daawat',
            phoneNumber: data.phoneNumber || '+01425 476563',
            address: data.address || '14 Market Pl, Ringwood BH24 1AW',
            openingHours: data.openingHours || 'Monday – Sunday: 5 PM – 11 PM',
            googleMapsUrl: data.googleMapsUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2516.3268800985556!2d-1.7946950232497645!3d50.84351336154673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4873998f804597b9%3A0xe53bcbeab7d73010!2s14%20Market%20Pl%2C%20Ringwood%20BH24%201AW%2C%20UK!5e0!3m2!1sen!2sus!4v1715844857416!5m2!1sen!2sus'
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postContact(formData);
      setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again or call us directly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '80px' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Get in Touch</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>WE WOULD LOVE TO HEAR FROM YOU</p>
        </div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          {/* Contact Info */}
          <div>
            <div style={{ marginBottom: '3rem' }}>
              <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Contact Information</h3>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>Opening Hours</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>{settings.openingHours}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>Phone Number</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>{settings.phoneNumber}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>Email Address</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>info@royaldaawat.co.uk</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>Restaurant Address</h4>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>{settings.address}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/book-table" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Book Now</Link>
              <Link to="/menu" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>View Menu</Link>
            </div>
          </div>

          {/* Contact Form */}
          <form 
            onSubmit={handleSubmit}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              padding: '3rem', 
              borderRadius: '20px', 
              border: '1px solid rgba(182, 162, 94, 0.1)'
            }}
          >
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input 
                type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required 
                style={{ width: '100%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input 
                type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required 
                style={{ width: '100%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input 
                type="tel" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange}
                style={{ width: '100%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <textarea 
                name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required 
                style={{ width: '100%', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', resize: 'none' }}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? 'Sending...' : <>SEND MESSAGE <Send size={18} /></>}
            </button>

            {status.message && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                borderRadius: '8px', 
                backgroundColor: status.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                color: status.type === 'success' ? '#4caf50' : '#f44336',
                textAlign: 'center',
                border: `1px solid ${status.type === 'success' ? '#4caf50' : '#f44336'}`
              }}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        {/* Map */}
        <div style={{ marginTop: '5rem', height: '450px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(182, 162, 94, 0.2)' }}>
          <MapWrapper googleMapsUrl={settings.googleMapsUrl} height="100%" />
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
