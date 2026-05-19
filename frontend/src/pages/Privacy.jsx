import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      title: "Information Collection",
      content: "We collect information when you visit our site, register, place an order, or subscribe to our newsletter. This may include your name, email address, mailing address, and phone number."
    },
    {
      title: "Cookies",
      content: "We use cookies to improve your experience on our site. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information."
    },
    {
      title: "Security",
      content: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential."
    },
    {
      title: "User Rights",
      content: "You have the right to request access to the personal data we hold about you, to request that we correct any inaccuracies, and to request that we delete your personal data. To exercise these rights, please contact us."
    },
    {
      title: "Data Usage",
      content: "The information we collect from you may be used in one of the following ways: To personalize your experience, to improve our website, to improve customer service, and to process transactions. Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: '#020508', minHeight: '100vh', paddingTop: '150px', paddingBottom: '80px' }}
    >
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'left', marginBottom: '4rem', padding: '0 20px' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Privacy Policy</h2>
        </div>

        <div style={{ padding: '0 20px' }}>
          {sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '3rem' }}>
              <h3 className="cinzel-font text-gold" style={{ fontSize: '1.4rem', marginBottom: '1.2rem', fontWeight: 'bold' }}>{section.title}</h3>
              <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem', textAlign: 'justify' }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;
