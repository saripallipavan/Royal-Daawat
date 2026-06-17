import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Mail, User, MessageSquare } from 'lucide-react';
import dish2 from '../assets/dish2.jpg';
import { getSettings } from '../services/api';

const GiftCard = () => {
  const [settings, setSettings] = useState({
    phoneNumber: '+01425 476563',
    openingHours: 'Monday – Sunday: 5 PM – 11 PM',
    giftCardPurchaseUrl: '',
    giftCardPurchaseLabel: '',
    giftCardPurchaseUrl2: '',
    giftCardPurchaseLabel2: '',
    giftCardPurchaseUrl3: '',
    giftCardPurchaseLabel3: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSettings = async () => {
      try {
        const { data } = await getSettings();
        if (data) {
          setSettings(prev => ({
            ...prev,
            phoneNumber: data.phoneNumber || prev.phoneNumber,
            openingHours: data.openingHours || prev.openingHours,
            giftCardPurchaseUrl: data.giftCardPurchaseUrl || '',
            giftCardPurchaseLabel: data.giftCardPurchaseLabel || '',
            giftCardPurchaseUrl2: data.giftCardPurchaseUrl2 || '',
            giftCardPurchaseLabel2: data.giftCardPurchaseLabel2 || '',
            giftCardPurchaseUrl3: data.giftCardPurchaseUrl3 || '',
            giftCardPurchaseLabel3: data.giftCardPurchaseLabel3 || ''
          }));
        }
      } catch (err) {
        console.error("Failed to load settings in GiftCard:", err);
      }
    };
    fetchSettings();
  }, []);

  const amounts = [25, 50, 100, 250];

  // Purchase states
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountVal, setCustomAmountVal] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchaseInit = (amount) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setIsPurchasing(true);
  };

  const handleCustomPurchaseInit = () => {
    setSelectedAmount(0);
    setIsCustomAmount(true);
    setIsPurchasing(true);
  };

  const getFinalAmount = () => {
    if (isCustomAmount) {
      return parseFloat(customAmountVal) || 0;
    }
    return selectedAmount;
  };

  const handleConfirmPurchase = () => {
    const finalAmount = getFinalAmount();
    if (finalAmount <= 0) {
      alert("Please select or enter a valid voucher amount.");
      return;
    }
    if (!senderName.trim()) {
      alert("Please enter Sender Name.");
      return;
    }
    if (!recipientName.trim()) {
      alert("Please enter Recipient Name.");
      return;
    }
    if (!recipientContact.trim()) {
      alert("Please enter Recipient Contact (Email or Phone number).");
      return;
    }

    // Compile WhatsApp checkout details
    const message = encodeURIComponent(
      `*New Gift Voucher Purchase Request - Royal Daawat*\n\n` +
      `- *Voucher Amount:* £${finalAmount.toFixed(2)}\n` +
      `- *From (Sender):* ${senderName}\n` +
      `- *To (Recipient):* ${recipientName}\n` +
      `- *Recipient Contact:* ${recipientContact}\n` +
      `- *Personal Message:* ${personalMessage.trim() || 'None'}\n\n` +
      `Please provide details on how to make payment and receive the voucher. Thank you!`
    );

    const rawPhone = settings.phoneNumber || '+441425476563';
    let cleanedPhone = rawPhone.replace(/\s+/g, '').replace(/\+/g, '');
    if (cleanedPhone.startsWith('0') && cleanedPhone.length === 11) {
      cleanedPhone = '44' + cleanedPhone.slice(1);
    }

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Reset and close
    setIsPurchasing(false);
    setSenderName('');
    setRecipientName('');
    setRecipientContact('');
    setPersonalMessage('');
    setCustomAmountVal('');
    alert("Voucher details compiled! Opening WhatsApp to complete payment and issue your Gift Card...");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ backgroundColor: 'var(--dark-bg)', minHeight: '100vh', paddingTop: '150px', paddingBottom: '80px' }}
    >
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', margin: 0 }}>Gift Cards</h2>
          <div style={{ width: '80px', height: '2px', backgroundColor: 'var(--primary-color)', margin: '1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Give the gift of royal dining</p>
        </div>

        {/* Hero Card */}
        <div style={{ 
          width: '100%', 
          height: '400px', 
          backgroundImage: `url(${dish2})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          borderRadius: '20px',
          marginBottom: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(182, 162, 94, 0.15)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '20px' }}>
            <h3 className="cinzel-font text-gold" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', marginBottom: '1rem', letterSpacing: '1px' }}>Royal Daawat</h3>
            <p style={{ color: '#fff', fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>Exclusively Yours</p>
          </div>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', marginBottom: '4rem' }}>
          {amounts.map((amount) => (
            <motion.div
              key={amount}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                padding: '3rem 2rem',
                borderRadius: '20px',
                border: '1px solid rgba(182, 162, 94, 0.15)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
              }}
            >
              <h4 className="cinzel-font" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>GIFT VOUCHER</h4>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>£{amount}</div>
              <button 
                onClick={() => handlePurchaseInit(amount)}
                className="btn btn-primary" 
                style={{ marginTop: 'auto', width: '100%', padding: '12px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
              >
                PURCHASE
              </button>
            </motion.div>
          ))}

          {/* Custom Amount Option Card */}
          <motion.div
            whileHover={{ y: -10 }}
            style={{
              backgroundColor: 'rgba(182, 162, 94, 0.02)',
              padding: '3rem 2rem',
              borderRadius: '20px',
              border: '1px dashed var(--primary-color)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
            }}
          >
            <h4 className="cinzel-font" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>ANY AMOUNT</h4>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>Custom</div>
            <button 
              onClick={handleCustomPurchaseInit}
              className="btn btn-secondary" 
              style={{ marginTop: 'auto', width: '100%', padding: '12px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
            >
              CHOOSE AMOUNT
            </button>
          </motion.div>
        </div>
      </div>

      {/* Purchase Details Modal with Live Card Preview */}
      <AnimatePresence>
        {isPurchasing && (
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
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={() => setIsPurchasing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="giftcard-modal-container"
            >
              {/* Left Column: Live Card Preview */}
              <div style={{
                flex: '1 1 380px',
                backgroundColor: '#071F14',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: '1px solid rgba(182, 162, 94, 0.15)'
              }}>
                <h4 className="cinzel-font text-gold" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Live Voucher Preview</h4>
                
                {/* Visual Card Canvas */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1.58 / 1',
                  maxWidth: '340px',
                  background: 'linear-gradient(135deg, #0B2E1F 0%, #0F3D2A 100%)',
                  borderRadius: '15px',
                  border: '2px solid var(--primary-color)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Subtle Shimmer background */}
                  <div style={{
                    position: 'absolute', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}></div>

                  {/* Top: Brand Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                    <div>
                      <h5 className="cinzel-font text-gold" style={{ fontSize: '1.1rem', margin: 0, fontWeight: 'bold', letterSpacing: '1px' }}>ROYAL DAAWAT</h5>
                      <span style={{ fontSize: '0.55rem', color: '#fff', opacity: 0.6, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Flavours of India</span>
                    </div>
                    <Gift size={24} color="var(--primary-color)" />
                  </div>

                  {/* Middle: Details */}
                  <div style={{ zIndex: 1, margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>TO:</div>
                    <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {recipientName.trim() || 'RECIPIENT NAME'}
                    </div>
                    
                    {personalMessage.trim() && (
                      <div style={{ color: '#D8D8D8', fontSize: '0.6rem', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3, marginTop: '2px' }}>
                        "{personalMessage.trim()}"
                      </div>
                    )}
                  </div>

                  {/* Bottom: Sender & Amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                    <div style={{ minWidth: '0', flex: 1, marginRight: '10px' }}>
                      <div style={{ fontSize: '0.5rem', color: 'var(--primary-color)', textTransform: 'uppercase' }}>FROM:</div>
                      <div style={{ color: '#fff', fontSize: '0.75rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {senderName.trim() || 'SENDER NAME'}
                      </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
                      £{getFinalAmount().toFixed(0)}
                    </div>
                  </div>
                </div>

                <div style={{ color: '#8892b0', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.5 }}>
                  This voucher will be compiled into a digital code checkable at the restaurant.
                </div>
              </div>

              {/* Right Column: Checkout Form */}
              <div style={{
                flex: '1 1 450px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
              }}>
                {/* Close Button */}
                <button 
                  onClick={() => setIsPurchasing(false)}
                  style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                >
                  <X size={24} />
                </button>

                 <div style={{ marginBottom: '1.5rem' }}>
                  <h3 className="cinzel-font text-gold" style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>Gift Voucher Details</h3>
                  <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--primary-color)', marginBottom: '1.5rem' }}></div>
                  
                  {/* If online purchase links are configured, show them first as quick checkout options! */}
                  {(settings.giftCardPurchaseUrl || settings.giftCardPurchaseUrl2 || settings.giftCardPurchaseUrl3) && (
                    <div style={{ marginBottom: '2rem', padding: '20px', borderRadius: '12px', backgroundColor: 'rgba(182, 162, 94, 0.03)', border: '1px solid rgba(182, 162, 94, 0.15)' }}>
                      <span style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Online Purchase</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 15px 0' }}>Purchase instantly via our automated voucher partners:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {settings.giftCardPurchaseUrl && (
                          <a 
                            href={settings.giftCardPurchaseUrl}
                            className="btn btn-primary"
                            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px 0', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
                          >
                            Buy via {settings.giftCardPurchaseLabel || 'Online Store 1'}
                          </a>
                        )}
                        {settings.giftCardPurchaseUrl2 && (
                          <a 
                            href={settings.giftCardPurchaseUrl2}
                            className="btn btn-primary"
                            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px 0', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
                          >
                            Buy via {settings.giftCardPurchaseLabel2 || 'Online Store 2'}
                          </a>
                        )}
                        {settings.giftCardPurchaseUrl3 && (
                          <a 
                            href={settings.giftCardPurchaseUrl3}
                            className="btn btn-primary"
                            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px 0', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
                          >
                            Buy via {settings.giftCardPurchaseLabel3 || 'Online Store 3'}
                          </a>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
                        <span style={{ padding: '0 10px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or personalize for whatsapp</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Amount Selectors inside form */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Select Voucher Amount</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {amounts.map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setIsCustomAmount(false);
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            backgroundColor: (!isCustomAmount && selectedAmount === amt) ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            color: (!isCustomAmount && selectedAmount === amt) ? 'var(--dark-bg)' : '#fff',
                            border: (!isCustomAmount && selectedAmount === amt) ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s'
                          }}
                        >
                          £{amt}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsCustomAmount(true)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          backgroundColor: isCustomAmount ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                          color: isCustomAmount ? 'var(--dark-bg)' : '#fff',
                          border: isCustomAmount ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.2s'
                        }}
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Custom Amount input */}
                    {isCustomAmount && (
                      <div>
                        <label style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Voucher Value (£)</label>
                        <input
                          type="number"
                          min="5"
                          max="1000"
                          placeholder="Enter custom amount (Min. £5)"
                          value={customAmountVal}
                          onChange={(e) => setCustomAmountVal(e.target.value)}
                          style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Your Name (Sender)</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="var(--primary-color)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          style={{ width: '100%', padding: '10px 10px 10px 38px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Recipient Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="var(--primary-color)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="Name of recipient"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          style={{ width: '100%', padding: '10px 10px 10px 38px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Recipient Contact</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="var(--primary-color)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="Recipient email or phone number"
                          value={recipientContact}
                          onChange={(e) => setRecipientContact(e.target.value)}
                          style={{ width: '100%', padding: '10px 10px 10px 38px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Personal Message (Optional)</label>
                      <div style={{ position: 'relative' }}>
                        <MessageSquare size={16} color="var(--primary-color)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
                        <textarea
                          placeholder="A warm greeting or message (max 100 chars)..."
                          maxLength={100}
                          rows="2"
                          value={personalMessage}
                          onChange={(e) => setPersonalMessage(e.target.value)}
                          style={{ width: '100%', padding: '10px 10px 10px 38px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', outline: 'none', resize: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '1rem' }}>
                  <button
                    onClick={handleConfirmPurchase}
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '14px 0', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
                  >
                    PURCHASE VIA WHATSAPP
                  </button>
                  <button
                    onClick={() => setIsPurchasing(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '14px 0', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Cinzel, serif' }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GiftCard;
