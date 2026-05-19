import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      title: "Privacy Statement",
      content: "All data collected during your visit will be treated as confidential and will not be shared with third parties without your consent. If your name is in our database and you wish to have it removed or modified, we will comply within 72 hours of your request. To request changes or removal, please contact us."
    },
    {
      title: "Payment",
      content: (
        <>
          <p>Our delivery drivers carry a maximum of £10 in change, and all payments must be made in £ sterling. We accept the following payment methods:</p>
          <ul style={{ listStyleType: 'disc', marginLeft: '20px', margin: '15px 0' }}>
            <li>Credit/Charge cards: Visa and Mastercard</li>
            <li>Debit Cards: Delta and Switch</li>
          </ul>
          <p>By submitting your order, you are making an offer to purchase the specified item(s). We reserve the right to decline your order if necessary. If a refund is required, we will aim to credit your account within 7-10 working days.</p>
        </>
      )
    },
    {
      title: "Ordering & Cancellation",
      content: (
        <>
          <p>Your Order Confirmation serves as our agreement to deliver the paid products. If someone else placed the order for you, you agree that they acted as your agent. You can make changes to your order or delivery time up to 45 minutes before the delivery window begins. Changes must be made by calling the shop directly, and a new payment will be processed.</p>
          <p style={{ marginTop: '15px' }}>You may alter your delivery time slot up to 45 minutes before the scheduled start. The new time slot must be available.</p>
          <p style={{ marginTop: '15px' }}>You can cancel your order in full up to 45 minutes before the delivery window and we will strive to process a refund within 7-10 working days. Cancellations made within 45 minutes of the delivery window will incur full charges.</p>
        </>
      )
    },
    {
      title: "Products",
      content: "Side orders are subject to availability, and your manager may suggest alternatives for any out-of-stock items. While we take precautions, some products may contain nuts, and desserts or ice creams might have nut derivatives. We also make efforts to remove all bones from chicken and meat, but some may still be present. A minimum order value applies, and you will be notified if your order falls below this threshold."
    },
    {
      title: "Delivery Times",
      content: "We aim to provide an excellent food delivery service with a strong reputation for timely deliveries. However, unforeseen factors such as weather, staff illness, and traffic may occasionally affect our ability to meet this goal."
    },
    {
      title: "Latest Order Time",
      content: "Due to licensing regulations, we cannot accept orders for delivery or collection less than 20 minutes before our closing time. We kindly advise customers collecting orders to arrive before closing time. For any questions, please contact the shop and speak to the duty manager."
    },
    {
      title: "Contact Us",
      content: (
        <div style={{ lineHeight: '1.8' }}>
          <p>Royal Daawat</p>
          <p>14 Market Pl</p>
          <p>BH24 1AW</p>
          <p>Ringwood</p>
          <p>Tel: 01425476563</p>
          <p>Email address: info@royaldaawat.co.uk</p>
        </div>
      )
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
          <h2 className="cinzel-font text-gold" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Terms and Conditions</h2>
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

export default Terms;
