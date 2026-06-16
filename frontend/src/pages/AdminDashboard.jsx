import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getContact, getMenu, postMenu, deleteMenu, 
  getOffers, postOffer, deleteOffer, 
  getBookings, updateBookingStatus,
  getSettings, updateSettings, uploadSettingsImage,
  getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification,
  getGallery, postGallery, putGallery, deleteGallery, getImageUrl
} from '../services/api';
import { 
  LayoutDashboard, CalendarDays, Utensils, Image as ImageIcon, 
  Tags, Star, Settings as SettingsIcon, Bell, LogOut, 
  CheckCircle, XCircle, Clock, Trash2, Mail, ShieldCheck, Plus, Menu as MenuIcon
} from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState({ 
    bookings: [], 
    contact: [], 
    menu: [], 
    offers: [], 
    gallery: [], 
    settings: {}, 
    notifications: [] 
  });

  const [menuForm, setMenuForm] = useState({ food_name: '', price: '', description: '', category: '', dietary_preference: 'Non Veg' });
  const [offerForm, setOfferForm] = useState({ title: '', description: '', discount_percentage: '', startDate: '', expiry_date: '', active: true });
  const [galleryForm, setGalleryForm] = useState({ title: '', subtitle: '', sortOrder: '0' });
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    restaurantName: '',
    phoneNumber: '',
    address: '',
    openingHours: '',
    googleMapsUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    orderOnlineUrl: '',
    tableReservationsUrl: '',
    bookOnlineUrl: '',
    customLinks: [],
    signatureDishes: Array(3).fill(null).map(() => ({ name: '', price: '', desc: '', img: '' })),
    chefRecommendations: Array(2).fill(null).map(() => ({ name: '', desc: '', img: '' })),
    galleryPreviewSlides: Array(3).fill(null).map(() => ({ title: '', subtitle: '', desc: '', img: '' })),
    popupBanner: { enabled: false, title: '', description: '', img: '', link: '', buttonText: 'Learn More' }
  });

  const [imageFile, setImageFile] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);

  const fetchData = async () => {
    try {
      const [book, con, men, off, gal, setts, notifs] = await Promise.all([
        getBookings().catch(() => ({ data: [] })),
        getContact().catch(() => ({ data: [] })),
        getMenu().catch(() => ({ data: [] })),
        getOffers().catch(() => ({ data: [] })),
        getGallery().catch(() => ({ data: [] })),
        getSettings().catch(() => ({ data: {} })),
        getNotifications().catch(() => ({ data: [] }))
      ]);

      setData({
        bookings: book.data || [],
        contact: con.data || [],
        menu: men.data || [],
        offers: off.data || [],
        gallery: gal.data || [],
        settings: setts.data || {},
        notifications: notifs.data || []
      });

      if (setts.data) {
        setSettingsForm({
          restaurantName: setts.data.restaurantName || '',
          phoneNumber: setts.data.phoneNumber || '',
          address: setts.data.address || '',
          openingHours: setts.data.openingHours || '',
          googleMapsUrl: setts.data.googleMapsUrl || '',
          facebookUrl: setts.data.facebookUrl || '',
          instagramUrl: setts.data.instagramUrl || '',
          tiktokUrl: setts.data.tiktokUrl || '',
          orderOnlineUrl: setts.data.orderOnlineUrl || '',
          tableReservationsUrl: setts.data.tableReservationsUrl || '',
          bookOnlineUrl: setts.data.bookOnlineUrl || '',
          customLinks: setts.data.customLinks || [],
          signatureDishes: Array(3).fill(null).map((_, i) => ({
            name: setts.data.signatureDishes?.[i]?.name || '',
            price: setts.data.signatureDishes?.[i]?.price || '',
            desc: setts.data.signatureDishes?.[i]?.desc || '',
            img: setts.data.signatureDishes?.[i]?.img || ''
          })),
          chefRecommendations: Array(2).fill(null).map((_, i) => ({
            name: setts.data.chefRecommendations?.[i]?.name || '',
            desc: setts.data.chefRecommendations?.[i]?.desc || '',
            img: setts.data.chefRecommendations?.[i]?.img || ''
          })),
          galleryPreviewSlides: Array(3).fill(null).map((_, i) => ({
            title: setts.data.galleryPreviewSlides?.[i]?.title || '',
            subtitle: setts.data.galleryPreviewSlides?.[i]?.subtitle || '',
            desc: setts.data.galleryPreviewSlides?.[i]?.desc || '',
            img: setts.data.galleryPreviewSlides?.[i]?.img || ''
          })),
          popupBanner: {
            enabled: setts.data.popupBanner?.enabled || false,
            title: setts.data.popupBanner?.title || '',
            description: setts.data.popupBanner?.description || '',
            img: setts.data.popupBanner?.img || '',
            link: setts.data.popupBanner?.link || '',
            buttonText: setts.data.popupBanner?.buttonText || 'Learn More'
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Admin') {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(menuForm).forEach(key => fd.append(key, menuForm[key]));
    if (imageFile) fd.append('image', imageFile);
    await postMenu(fd);
    setMenuForm({ food_name: '', price: '', description: '', category: '', dietary_preference: 'Non Veg' });
    setImageFile(null);
    const fileInput = document.getElementById('menuImageInput');
    if (fileInput) fileInput.value = '';
    fetchData();
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(offerForm).forEach(key => fd.append(key, offerForm[key]));
    if (imageFile) fd.append('image', imageFile);
    if (offerForm.expiry_date) {
      fd.append('endDate', offerForm.expiry_date);
    }
    await postOffer(fd);
    setOfferForm({ title: '', description: '', discount_percentage: '', startDate: '', expiry_date: '', active: true });
    setImageFile(null);
    const fileInput = document.getElementById('offerImageInput');
    if (fileInput) fileInput.value = '';
    fetchData();
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', galleryForm.title);
    fd.append('subtitle', galleryForm.subtitle || '');
    fd.append('sortOrder', galleryForm.sortOrder);
    if (galleryFile) fd.append('image', galleryFile);
    
    try {
      if (editingGalleryId) {
        await putGallery(editingGalleryId, fd);
        setEditingGalleryId(null);
        alert('Gallery item updated successfully!');
      } else {
        if (!galleryFile) {
          alert('Please select an image file to upload.');
          return;
        }
        await postGallery(fd);
        alert('Gallery item uploaded successfully!');
      }
      setGalleryForm({ title: '', subtitle: '', sortOrder: '0' });
      setGalleryFile(null);
      const fileInput = document.getElementById('galleryImageInput');
      if (fileInput) fileInput.value = '';
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save gallery item');
    }
  };

  const handleEditGallery = (item) => {
    setEditingGalleryId(item._id);
    setGalleryForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      sortOrder: String(item.sortOrder || 0)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCustomLink = () => {
    setSettingsForm(prev => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { label: '', url: '' }]
    }));
  };

  const handleUpdateCustomLink = (index, field, value) => {
    setSettingsForm(prev => {
      const updated = [...(prev.customLinks || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customLinks: updated };
    });
  };

  const handleRemoveCustomLink = (index) => {
    setSettingsForm(prev => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleSettingsImageUpload = async (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadSettingsImage(fd);
      if (res.data && res.data.filePath) {
        const filePath = res.data.filePath;
        setSettingsForm(prev => {
          if (type === 'dishes') {
            const updated = [...prev.signatureDishes];
            updated[index] = { ...updated[index], img: filePath };
            return { ...prev, signatureDishes: updated };
          } else if (type === 'recs') {
            const updated = [...prev.chefRecommendations];
            updated[index] = { ...updated[index], img: filePath };
            return { ...prev, chefRecommendations: updated };
          } else if (type === 'slides') {
            const updated = [...prev.galleryPreviewSlides];
            updated[index] = { ...updated[index], img: filePath };
            return { ...prev, galleryPreviewSlides: updated };
          } else if (type === 'popup') {
            return {
              ...prev,
              popupBanner: {
                ...prev.popupBanner,
                img: filePath
              }
            };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image');
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      alert('Settings updated successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('Delete this menu item?')) {
      await deleteMenu(id);
      fetchData();
    }
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm('Delete this offer?')) {
      await deleteOffer(id);
      fetchData();
    }
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Delete this gallery image?')) {
      await deleteGallery(id);
      fetchData();
    }
  };

  const handleBookingAction = async (id, status) => {
    await updateBookingStatus(id, { status });
    fetchData();
  };

  const handleMarkNotifRead = async (id) => {
    await markNotificationRead(id);
    fetchData();
  };

  const handleMarkAllNotifsRead = async () => {
    await markAllNotificationsRead();
    fetchData();
  };

  const handleDeleteNotif = async (id) => {
    await deleteNotification(id);
    fetchData();
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysBookings = data.bookings.filter(b => b.bookingDate === today);
  const activeOffers = data.offers.filter(o => o.active !== false);
  const unreadCount = data.notifications.filter(n => !n.isRead).length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', label: 'Table Bookings', icon: <CalendarDays size={20} /> },
    { id: 'menu', label: 'Menu Management', icon: <Utensils size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { id: 'offers', label: 'Offers', icon: <Tags size={20} /> },
    { id: 'reviews', label: 'Reviews / Messages', icon: <Star size={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ backgroundColor: 'var(--primary-color)', color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '1px 5px', borderRadius: '10px' }}>
            {unreadCount}
          </span>
        )}
      </div>
    ) },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
            aria-label="Toggle Sidebar"
          >
            <MenuIcon size={24} />
          </button>
          <span className="cinzel-font text-gold" style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '1px' }}>Admin Panel</span>
        </div>
        <button
          type="button"
          onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
          style={{ background: 'transparent', border: 'none', color: '#f44336', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="cinzel-font text-gold" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Admin Panel</h2>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 25px', width: '100%',
                backgroundColor: activeTab === item.id ? 'rgba(182, 162, 94, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary-color)' : 'var(--text-muted)',
                border: 'none', borderRight: activeTab === item.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                cursor: 'pointer', textAlign: 'left', fontSize: '1rem', transition: 'all 0.3s'
              }}
            >
              {item.icon} <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 25px', width: '100%',
              backgroundColor: 'transparent', color: '#f44336', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', marginTop: '2rem'
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '15px', border: '1px solid rgba(182, 162, 94, 0.1)', minHeight: '80vh' }}>
          
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Dashboard Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '3rem' }}>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(182, 162, 94, 0.2)' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Today's Bookings</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{todaysBookings.length}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(182, 162, 94, 0.2)' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Total Bookings</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{data.bookings.length}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(182, 162, 94, 0.2)' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Active Offers</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{activeOffers.length}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(182, 162, 94, 0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(182, 162, 94, 0.2)' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Unread Alerts</h4>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{unreadCount}</div>
                </div>
              </div>

              <div className="admin-overview-grid">
                <div>
                  <h4 className="text-gold" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Recent Booking Requests</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(182, 162, 94, 0.1)', textAlign: 'left' }}>
                          <th style={{ padding: '12px' }}>Name</th>
                          <th style={{ padding: '12px' }}>Date/Time</th>
                          <th style={{ padding: '12px' }}>Guests</th>
                          <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.bookings.slice(0, 5).map(b => (
                          <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px' }}>{b.name || `${b.firstName} ${b.lastName}`}</td>
                            <td style={{ padding: '12px' }}>{b.bookingDate} at {b.bookingTime}</td>
                            <td style={{ padding: '12px' }}>{b.guestCount}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ color: b.status === 'Approved' ? '#4CAF50' : b.status === 'Pending' ? 'var(--primary-color)' : '#f44336' }}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                        {data.bookings.length === 0 && (
                          <tr>
                            <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-gold" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Recent Activity Alerts</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.notifications.slice(0, 5).map(n => (
                      <div key={n._id} style={{ 
                        backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px 15px', borderRadius: '8px', 
                        borderLeft: `3px solid ${n.isRead ? '#444' : 'var(--primary-color)'}`,
                        opacity: n.isRead ? 0.7 : 1
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <strong style={{ fontSize: '0.9rem' }}>{n.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc' }}>{n.message}</p>
                      </div>
                    ))}
                    {data.notifications.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No alerts found</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Table Bookings</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(182, 162, 94, 0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>Customer Name</th>
                      <th style={{ padding: '12px' }}>Phone Number</th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Time</th>
                      <th style={{ padding: '12px' }}>Guests</th>
                      <th style={{ padding: '12px' }}>Special Request</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bookings.map(b => (
                      <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <td style={{ padding: '12px' }}>{b.name || `${b.firstName} ${b.lastName}`}</td>
                        <td style={{ padding: '12px' }}>{b.phone}</td>
                        <td style={{ padding: '12px' }}>{b.bookingDate}</td>
                        <td style={{ padding: '12px' }}>{b.bookingTime}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{b.guestCount}</td>
                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{b.specialRequest || '-'}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                            backgroundColor: b.status === 'Approved' ? 'rgba(76, 175, 80, 0.2)' : b.status === 'Pending' ? 'rgba(182, 162, 94, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                            color: b.status === 'Approved' ? '#4CAF50' : b.status === 'Pending' ? 'var(--primary-color)' : '#f44336'
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleBookingAction(b._id, 'Approved')} style={{ background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer' }} title="Approve"><CheckCircle size={18} /></button>
                            <button onClick={() => handleBookingAction(b._id, 'Rejected')} style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer' }} title="Reject"><XCircle size={18} /></button>
                            <button onClick={() => handleBookingAction(b._id, 'Rescheduled')} style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer' }} title="Reschedule"><Clock size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {data.bookings.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No table bookings currently recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Manage Menu</h3>
              <form onSubmit={handleMenuSubmit} style={{ display: 'grid', gap: '15px', marginBottom: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px' }}>
                <input type="text" placeholder="Food Name" value={menuForm.food_name} onChange={e => setMenuForm({...menuForm, food_name: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} />
                <input type="number" placeholder="Price" value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} />
                <input type="text" placeholder="Category" value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} />
                <select value={menuForm.dietary_preference} onChange={e => setMenuForm({...menuForm, dietary_preference: e.target.value})} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}>
                  <option value="Non Veg">Non Veg</option>
                  <option value="Veg">Veg</option>
                </select>
                <textarea placeholder="Description" value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}></textarea>
                <input type="file" id="menuImageInput" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#fff' }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Add Menu Item</button>
              </form>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {data.menu.map(m => (
                  <div key={m._id} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{m.food_name} (£{m.price})</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>{m.category} • {m.dietary_preference}</p>
                    <button onClick={() => handleDeleteMenu(m._id)} style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Manage Offers</h3>
              <form onSubmit={handleOfferSubmit} style={{ display: 'grid', gap: '15px', marginBottom: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px' }}>
                <input type="text" placeholder="Offer Title" value={offerForm.title} onChange={e => setOfferForm({...offerForm, title: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} />
                <input type="number" placeholder="Discount Percentage" value={offerForm.discount_percentage} onChange={e => setOfferForm({...offerForm, discount_percentage: e.target.value})} required style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} />
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input type="date" placeholder="Start Date" value={offerForm.startDate} onChange={e => setOfferForm({...offerForm, startDate: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333', colorScheme: 'dark' }} />
                  <input type="date" placeholder="Expiry Date" value={offerForm.expiry_date} onChange={e => setOfferForm({...offerForm, expiry_date: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333', colorScheme: 'dark' }} />
                </div>
                <textarea placeholder="Description" value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}></textarea>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                  <input type="checkbox" id="activeOffer" checked={offerForm.active} onChange={e => setOfferForm({...offerForm, active: e.target.checked})} />
                  <label htmlFor="activeOffer">Active</label>
                </div>
                <input type="file" id="offerImageInput" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#fff' }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Add Offer</button>
              </form>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {data.offers.map(o => (
                  <div key={o._id} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', backgroundColor: o.active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)', color: o.active ? '#4CAF50' : '#f44336' }}>
                      {o.active ? 'Active' : 'Disabled'}
                    </div>
                    <h4 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>{o.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>{o.discount_percentage}% OFF</p>
                    <p style={{ color: '#fff', fontSize: '0.8rem', marginBottom: '15px' }}>
                      {o.startDate && o.expiry_date ? `${new Date(o.startDate).toLocaleDateString()} to ${new Date(o.expiry_date).toLocaleDateString()}` : 'No date range set'}
                    </p>
                    <button onClick={() => handleDeleteOffer(o._id)} style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                {editingGalleryId ? 'Edit Gallery Item' : 'Gallery Management'}
              </h3>
              <form onSubmit={handleGallerySubmit} style={{ display: 'grid', gap: '15px', marginBottom: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Image Title / Caption (Header)" 
                  value={galleryForm.title} 
                  onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} 
                  style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                />
                <input 
                  type="text" 
                  placeholder="Image Sub-caption / Description (Sub-column)" 
                  value={galleryForm.subtitle} 
                  onChange={e => setGalleryForm({...galleryForm, subtitle: e.target.value})} 
                  style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                />
                <input 
                  type="number" 
                  placeholder="Sort Order (Lower numbers show first)" 
                  value={galleryForm.sortOrder} 
                  onChange={e => setGalleryForm({...galleryForm, sortOrder: e.target.value})} 
                  style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                />
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="galleryImageInput" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Select Image File {!editingGalleryId && <span style={{ color: 'var(--primary-color)' }}>*</span>}
                  </label>
                  <input 
                    type="file" 
                    id="galleryImageInput" 
                    required={!editingGalleryId} 
                    onChange={e => setGalleryFile(e.target.files[0])} 
                    style={{ color: '#fff' }} 
                  />
                  {editingGalleryId && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leave empty to keep current image</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                    {editingGalleryId ? 'Save Changes' : 'Upload Image'}
                  </button>
                  {editingGalleryId && (
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={() => {
                        setEditingGalleryId(null);
                        setGalleryForm({ title: '', subtitle: '', sortOrder: '0' });
                        setGalleryFile(null);
                        const fileInput = document.getElementById('galleryImageInput');
                        if (fileInput) fileInput.value = '';
                      }}
                      style={{ width: 'fit-content', backgroundColor: '#333', color: '#fff', border: '1px solid #444' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {data.gallery.map(g => (
                  <div key={g._id} style={{ 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ width: '100%', height: '150px', position: 'relative' }}>
                      <ImageWithFallback 
                        src={getImageUrl(g.image)} 
                        alt={g.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <span style={{ 
                        position: 'absolute', top: '5px', right: '5px', 
                        backgroundColor: 'rgba(0,0,0,0.8)', color: 'var(--primary-color)',
                        fontSize: '0.7rem', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold'
                      }}>
                        Order: {g.sortOrder || 0}
                      </span>
                    </div>
                    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: 'bold' }}>{g.title || '(No Title)'}</p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{g.subtitle || '(No Subtitle)'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        <button 
                          onClick={() => handleEditGallery(g)}
                          style={{ 
                            flex: 1,
                            backgroundColor: 'rgba(182, 162, 94, 0.1)', color: 'var(--primary-color)', 
                            border: '1px solid rgba(182, 162, 94, 0.3)', padding: '6px 5px', 
                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteGallery(g._id)} 
                          style={{ 
                            flex: 1,
                            backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#ff4436', 
                            border: '1px solid rgba(244, 67, 54, 0.3)', padding: '6px 5px', 
                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                          }}
                        >
                          <Trash2 size={12} fill="none" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {data.gallery.length === 0 && (
                  <div style={{ colSpan: '100%', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No gallery images found.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Customer Messages</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {data.contact.map(c => (
                  <div key={c._id} style={{ 
                    backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '10px', 
                    border: '1px solid rgba(255,255,255,0.05)', position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>{c.name}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '10px' }}>({c.email})</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    {c.phone && <p style={{ fontSize: '0.85rem', color: '#ccc', margin: '0 0 10px 0' }}><strong>Phone:</strong> {c.phone}</p>}
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff', lineHeight: '1.5' }}>{c.message}</p>
                    
                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                      <a href={`mailto:${c.email}?subject=Reply from Royal Daawat`} style={{ 
                        textDecoration: 'none', color: '#000', backgroundColor: 'var(--primary-color)',
                        padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                        display: 'inline-flex', alignItems: 'center', gap: '6px'
                      }}>
                        <Mail size={14} /> Send Email Reply
                      </a>
                    </div>
                  </div>
                ))}
                {data.contact.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No customer contact messages found.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Restaurant Variables & Settings</h3>
              <form onSubmit={handleSettingsSubmit} style={{ display: 'grid', gap: '20px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                
                <div className="admin-grid-2col">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Restaurant Name</label>
                    <input 
                      type="text" 
                      value={settingsForm.restaurantName} 
                      onChange={e => setSettingsForm({...settingsForm, restaurantName: e.target.value})} 
                      required 
                      style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Telephone Number</label>
                    <input 
                      type="text" 
                      value={settingsForm.phoneNumber} 
                      onChange={e => setSettingsForm({...settingsForm, phoneNumber: e.target.value})} 
                      required 
                      style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Physical Address</label>
                  <input 
                    type="text" 
                    value={settingsForm.address} 
                    onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} 
                    required 
                    style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Opening Hours Description</label>
                  <input 
                    type="text" 
                    value={settingsForm.openingHours} 
                    onChange={e => setSettingsForm({...settingsForm, openingHours: e.target.value})} 
                    required 
                    style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Google Maps Embed Iframe URL</label>
                  <textarea 
                    value={settingsForm.googleMapsUrl} 
                    onChange={e => setSettingsForm({...settingsForm, googleMapsUrl: e.target.value})} 
                    rows="3"
                    style={{ padding: '12px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333', fontFamily: 'monospace', fontSize: '0.85rem' }} 
                  />
                </div>

                <h4 className="text-gold" style={{ margin: '10px 0 5px 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>External Integration Links</h4>

                <div className="admin-grid-3col">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Online URL (Custom)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., https://ubereats.com/... (leave empty for internal menu)"
                      value={settingsForm.orderOnlineUrl} 
                      onChange={e => setSettingsForm({...settingsForm, orderOnlineUrl: e.target.value})} 
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Table Reservations URL (Custom)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., https://opentable.com/... (leave empty for internal booking)"
                      value={settingsForm.tableReservationsUrl} 
                      onChange={e => setSettingsForm({...settingsForm, tableReservationsUrl: e.target.value})} 
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Book Online URL</label>
                    <input 
                      type="text" 
                      placeholder="e.g., https://book.royaldaawat.com/..."
                      value={settingsForm.bookOnlineUrl} 
                      onChange={e => setSettingsForm({...settingsForm, bookOnlineUrl: e.target.value})} 
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                </div>

                <h4 className="text-gold" style={{ margin: '20px 0 5px 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Custom Integration Links</span>
                  <button 
                    type="button" 
                    onClick={handleAddCustomLink}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px', 
                      backgroundColor: 'transparent', 
                      color: 'var(--gold)', 
                      border: '1px dashed var(--gold)', 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Plus size={14} /> Add Link
                  </button>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {(!settingsForm.customLinks || settingsForm.customLinks.length === 0) && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '5px 0' }}>No custom links added yet.</p>
                  )}
                  {settingsForm.customLinks && settingsForm.customLinks.map((link, idx) => (
                    <div key={idx} className="custom-link-row">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Link Label</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Book Event"
                          value={link.label}
                          onChange={e => handleUpdateCustomLink(idx, 'label', e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Link Target URL</label>
                        <input 
                          type="text" 
                          placeholder="e.g., https://..."
                          value={link.url}
                          onChange={e => handleUpdateCustomLink(idx, 'url', e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveCustomLink(idx)}
                        className="custom-link-delete-btn"
                        style={{ 
                          padding: '10px', 
                          borderRadius: '6px', 
                          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                          color: '#ef4444', 
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '42px',
                          width: '42px'
                        }}
                        title="Delete custom link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <h4 className="text-gold" style={{ margin: '10px 0 5px 0', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Social Profiles</h4>

                <div className="admin-grid-3col">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Facebook Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.facebookUrl} 
                      onChange={e => setSettingsForm({...settingsForm, facebookUrl: e.target.value})} 
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instagram Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.instagramUrl} 
                      onChange={e => setSettingsForm({...settingsForm, instagramUrl: e.target.value})} 
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TikTok Link</label>
                    <input 
                      type="text" 
                      value={settingsForm.tiktokUrl} 
                      onChange={e => setSettingsForm({...settingsForm, tiktokUrl: e.target.value})} 
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }} 
                    />
                  </div>
                </div>

                <h4 className="text-gold" style={{ margin: '30px 0 10px 0', fontSize: '1.4rem', borderBottom: '1px solid rgba(182, 162, 94, 0.3)', paddingBottom: '8px' }}>Homepage Signature Dishes (3 Items)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {settingsForm.signatureDishes.map((dish, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(182, 162, 94, 0.15)', borderRadius: '10px' }}>
                      <strong className="text-gold" style={{ fontSize: '1.1rem', display: 'block', marginBottom: '1rem' }}>Signature Dish #{idx + 1}</strong>
                      <div className="admin-grid-3col" style={{ gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Butter Chicken"
                            value={dish.name} 
                            onChange={e => {
                              const updated = [...settingsForm.signatureDishes];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setSettingsForm({ ...settingsForm, signatureDishes: updated });
                            }}
                            style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price</label>
                          <input 
                            type="text" 
                            placeholder="e.g., £14.95"
                            value={dish.price} 
                            onChange={e => {
                              const updated = [...settingsForm.signatureDishes];
                              updated[idx] = { ...updated[idx], price: e.target.value };
                              setSettingsForm({ ...settingsForm, signatureDishes: updated });
                            }}
                            style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Image File</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                              type="file" 
                              onChange={e => handleSettingsImageUpload(e, 'dishes', idx)}
                              style={{ color: '#fff', fontSize: '0.85rem', flex: 1 }}
                            />
                            {dish.img && (
                              <div style={{ width: '45px', height: '45px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(182, 162, 94, 0.3)' }}>
                                <ImageWithFallback src={getImageUrl(dish.img)} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                        <textarea 
                          placeholder="Brief description of the dish..."
                          value={dish.desc} 
                          onChange={e => {
                            const updated = [...settingsForm.signatureDishes];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setSettingsForm({ ...settingsForm, signatureDishes: updated });
                          }}
                          rows="2"
                          style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-gold" style={{ margin: '30px 0 10px 0', fontSize: '1.4rem', borderBottom: '1px solid rgba(182, 162, 94, 0.3)', paddingBottom: '8px' }}>Homepage Chef's Recommendations (2 Items)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {settingsForm.chefRecommendations.map((rec, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(182, 162, 94, 0.15)', borderRadius: '10px' }}>
                      <strong className="text-gold" style={{ fontSize: '1.1rem', display: 'block', marginBottom: '1rem' }}>Recommendation #{idx + 1}</strong>
                      <div className="admin-grid-2col" style={{ gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Seafood Moilee"
                            value={rec.name} 
                            onChange={e => {
                              const updated = [...settingsForm.chefRecommendations];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setSettingsForm({ ...settingsForm, chefRecommendations: updated });
                            }}
                            style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Image File</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                              type="file" 
                              onChange={e => handleSettingsImageUpload(e, 'recs', idx)}
                              style={{ color: '#fff', fontSize: '0.85rem', flex: 1 }}
                            />
                            {rec.img && (
                              <div style={{ width: '45px', height: '45px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(182, 162, 94, 0.3)' }}>
                                <ImageWithFallback src={getImageUrl(rec.img)} alt={rec.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                        <textarea 
                          placeholder="Brief description of the recommendation..."
                          value={rec.desc} 
                          onChange={e => {
                            const updated = [...settingsForm.chefRecommendations];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setSettingsForm({ ...settingsForm, chefRecommendations: updated });
                          }}
                          rows="2"
                          style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-gold" style={{ margin: '30px 0 10px 0', fontSize: '1.4rem', borderBottom: '1px solid rgba(182, 162, 94, 0.3)', paddingBottom: '8px' }}>Homepage Visual Journey Slides (3 Items)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {settingsForm.galleryPreviewSlides.map((slide, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(182, 162, 94, 0.15)', borderRadius: '10px' }}>
                      <strong className="text-gold" style={{ fontSize: '1.1rem', display: 'block', marginBottom: '1rem' }}>Slide #{idx + 1}</strong>
                      <div className="admin-grid-3col" style={{ gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Aromatic Dum Biryani"
                            value={slide.title} 
                            onChange={e => {
                              const updated = [...settingsForm.galleryPreviewSlides];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setSettingsForm({ ...settingsForm, galleryPreviewSlides: updated });
                            }}
                            style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subtitle</label>
                          <input 
                            type="text" 
                            placeholder="e.g., SIGNATURE FEAST"
                            value={slide.subtitle} 
                            onChange={e => {
                              const updated = [...settingsForm.galleryPreviewSlides];
                              updated[idx] = { ...updated[idx], subtitle: e.target.value };
                              setSettingsForm({ ...settingsForm, galleryPreviewSlides: updated });
                            }}
                            style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Image File</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                              type="file" 
                              onChange={e => handleSettingsImageUpload(e, 'slides', idx)}
                              style={{ color: '#fff', fontSize: '0.85rem', flex: 1 }}
                            />
                            {slide.img && (
                              <div style={{ width: '45px', height: '45px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(182, 162, 94, 0.3)' }}>
                                <ImageWithFallback src={getImageUrl(slide.img)} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                        <textarea 
                          placeholder="Brief description of the slide topic..."
                          value={slide.desc} 
                          onChange={e => {
                            const updated = [...settingsForm.galleryPreviewSlides];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setSettingsForm({ ...settingsForm, galleryPreviewSlides: updated });
                          }}
                          rows="2"
                          style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-gold" style={{ margin: '30px 0 10px 0', fontSize: '1.4rem', borderBottom: '1px solid rgba(182, 162, 94, 0.3)', paddingBottom: '8px' }}>Promotional Pop-up Banner</h4>
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(182, 162, 94, 0.15)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      id="enablePopupBanner"
                      checked={settingsForm.popupBanner?.enabled || false} 
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        popupBanner: {
                          ...settingsForm.popupBanner,
                          enabled: e.target.checked
                        }
                      })}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <label htmlFor="enablePopupBanner" style={{ fontSize: '1rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                      Enable Pop-up Banner
                    </label>
                  </div>

                  <div className="admin-grid-2col" style={{ gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Banner Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Weekend Special Feast!"
                        value={settingsForm.popupBanner?.title || ''} 
                        onChange={e => setSettingsForm({
                          ...settingsForm,
                          popupBanner: {
                            ...settingsForm.popupBanner,
                            title: e.target.value
                          }
                        })}
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Banner Image</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="file" 
                          onChange={e => handleSettingsImageUpload(e, 'popup')}
                          style={{ color: '#fff', fontSize: '0.85rem', flex: 1 }}
                        />
                        {settingsForm.popupBanner?.img && (
                          <div style={{ width: '45px', height: '45px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(182, 162, 94, 0.3)' }}>
                            <ImageWithFallback src={getImageUrl(settingsForm.popupBanner.img)} alt="banner preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-grid-2col" style={{ gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action Button Label</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Order Now"
                        value={settingsForm.popupBanner?.buttonText || ''} 
                        onChange={e => setSettingsForm({
                          ...settingsForm,
                          popupBanner: {
                            ...settingsForm.popupBanner,
                            buttonText: e.target.value
                          }
                        })}
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirection Link Target</label>
                      <input 
                        type="text" 
                        placeholder="e.g., /menu, /book-table, or https://..."
                        value={settingsForm.popupBanner?.link || ''} 
                        onChange={e => setSettingsForm({
                          ...settingsForm,
                          popupBanner: {
                            ...settingsForm.popupBanner,
                            link: e.target.value
                          }
                        })}
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Banner Description</label>
                    <textarea 
                      placeholder="Brief details of your popup banner message..."
                      value={settingsForm.popupBanner?.description || ''} 
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        popupBanner: {
                          ...settingsForm.popupBanner,
                          description: e.target.value
                        }
                      })}
                      rows="3"
                      style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #333' }}
                    />
                  </div>

                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
                  Save Configuration
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-gold" style={{ margin: 0, fontSize: '1.8rem' }}>Activity Logs & Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllNotifsRead} 
                    style={{ 
                      backgroundColor: 'rgba(182, 162, 94, 0.1)', color: 'var(--primary-color)',
                      border: '1px solid rgba(182, 162, 94, 0.3)', padding: '8px 16px', borderRadius: '4px',
                      cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <ShieldCheck size={16} /> Mark All as Read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.notifications.map(n => (
                  <div key={n._id} style={{ 
                    backgroundColor: n.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(182, 162, 94, 0.03)', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    borderLeft: `4px solid ${n.isRead ? '#333' : 'var(--primary-color)'}`,
                    borderTop: '1px solid rgba(255,255,255,0.02)',
                    borderRight: '1px solid rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔔</span>
                        <strong style={{ fontSize: '1.05rem', color: n.isRead ? '#ccc' : '#fff' }}>{n.title}</strong>
                        {!n.isRead && (
                          <span style={{ 
                            backgroundColor: 'var(--primary-color)', color: '#000', 
                            fontSize: '0.65rem', fontWeight: 'bold', padding: '1px 5px', borderRadius: '3px' 
                          }}>
                            NEW
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: n.isRead ? '#888' : '#bbb' }}>{n.message}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {!n.isRead && (
                        <button 
                          onClick={() => handleMarkNotifRead(n._id)} 
                          style={{ 
                            backgroundColor: 'transparent', color: 'var(--primary-color)',
                            border: '1px solid rgba(182, 162, 94, 0.2)', padding: '6px 12px', borderRadius: '4px',
                            cursor: 'pointer', fontSize: '0.8rem'
                          }}
                        >
                          Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteNotif(n._id)} 
                        style={{ 
                          backgroundColor: 'transparent', color: '#ff4436',
                          border: '1px solid rgba(244, 67, 54, 0.2)', padding: '6px 12px', borderRadius: '4px',
                          cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                {data.notifications.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No alerts or notifications recorded.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
