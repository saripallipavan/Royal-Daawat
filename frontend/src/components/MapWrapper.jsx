import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Wifi } from 'lucide-react';
import mapSatellite from '../assets/map_satellite.jpg';

const MapWrapper = ({ googleMapsUrl, height = "100%" }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Construct a premium satellite view embed URL by default if using standard search embed
  // If the URL is the default pb embed, we can also inject satellite-friendly properties or fallback
  const finalEmbedUrl = googleMapsUrl 
    ? googleMapsUrl.replace('output=embed', 'output=embed&t=k') 
    : 'https://maps.google.com/maps?q=14%20Market%20Pl,%20Ringwood%20BH24%201AW&t=k&z=19&ie=UTF8&iwloc=&output=embed';

  const liveMapUrl = "https://www.google.com/maps/place/14+Market+Pl,+Ringwood+BH24+1AW,+UK/@50.843513,-1.792225,19z/data=!3m1!1e3";

  if (!isOnline) {
    return (
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: height, 
          overflow: 'hidden', 
          backgroundColor: '#0a1a14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <motion.div 
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5 }}
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundImage: `url(${mapSatellite})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
          onClick={() => window.open(liveMapUrl, '_blank')}
        />
        
        {/* Offline Banner Overlay */}
        <div 
          style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            right: '15px',
            backgroundColor: 'rgba(11, 46, 31, 0.95)',
            border: '1px solid var(--primary-color)',
            borderRadius: '12px',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--primary-color)' }}>
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="cinzel-font text-gold" style={{ fontSize: '0.85rem', margin: 0, letterSpacing: '1px' }}>14 Market Place</h4>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Ringwood BH24 1AW</p>
            </div>
          </div>
          <span 
            style={{ 
              fontSize: '0.65rem', 
              color: 'var(--primary-color)', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '3px 8px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
            onClick={() => window.open(liveMapUrl, '_blank')}
          >
            OPEN IN GOOGLE MAPS <ExternalLink size={10} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: height, position: 'relative' }}>
      <iframe 
        src={finalEmbedUrl} 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapWrapper;
