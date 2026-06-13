import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMedia, getImageUrl } from '../services/api';
import { ExternalLink } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const Media = () => {
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      title: "Euro Star Awards 2024 Winner",
      category: "Awards",
      date: "2024-03-15",
      link: "https://example.com/awards",
      image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80"
    },
    {
      id: 2,
      title: "Royal Daawat's New Grand Launch in Walton",
      category: "New Launch",
      date: "2024-01-10",
      link: "https://example.com/news",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
    }
  ]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await getMedia();
        if (response.data && response.data.length > 0) {
          const backendMedia = response.data.map(item => ({
            ...item,
            image: getImageUrl(item.image)
          }));
          setMediaItems(prev => [...prev, ...backendMedia]);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };
    fetchMedia();
    window.scrollTo(0, 0);
  }, []);



  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>Royal Daawat Media</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px' }}>LATEST NEWS, AWARDS & PRESS COVERAGE</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {mediaItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid rgba(182, 162, 94, 0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <ImageWithFallback 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#000',
                  padding: '5px 15px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  textTransform: 'uppercase'
                }}>
                  {item.category}
                </span>
              </div>
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="cinzel-font" style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  READ ARTICLE <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Media;
