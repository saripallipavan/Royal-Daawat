import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

// Intercept requests to add auth token if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getGallery = () => API.get('/gallery');
export const postGallery = (data) => API.post('/gallery', data);
export const deleteGallery = (id) => API.delete(`/gallery/${id}`);

export const getMedia = () => API.get('/media');
export const postMedia = (data) => API.post('/media', data);

export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = () => API.get('/bookings');
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

export const postContact = (data) => API.post('/contact', data);
export const getContact = () => API.get('/contact');

export const getMenu = () => API.get('/menu');
export const postMenu = (data) => API.post('/menu', data);
export const putMenu = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenu = (id) => API.delete(`/menu/${id}`);

export const getOffers = () => API.get('/offers');
export const postOffer = (data) => API.post('/offers', data);
export const deleteOffer = (id) => API.delete(`/offers/${id}`);

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);

export const getSettings = () => API.get('/settings');
export const updateSettings = (data) => API.put('/settings', data);

export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${cleanBase}/${cleanPath.replace(/\\/g, '/')}`;
};

export default API;
