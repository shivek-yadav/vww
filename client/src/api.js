import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  timeout: 16000
});

// Automatically inject Bearer token from localStorage for bulletproof cross-origin auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dakshayani_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  r => r,
  err => Promise.reject(new Error(err.response?.data?.message || err.message || 'Something went wrong'))
);

export const money = (n, symbol = '₹') => `${symbol}${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const prettyDate = (s) => s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const photoFallback = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80';

export const initialSettings = {
  restaurantName: 'Vijay Woollen Works',
  tagline: 'Knitwear & Uniforms Manufacturer',
  phone: '+91 84272 57106',
  email: 'vijaywoolenwork@gmail.com',
  address: 'B-V-1209, Purana Bazaar, Buhrampuri, Ludhiana - 141008, Punjab, India',
  city: 'Ludhiana',
  openingHours: [],
  bookingEnabled: true,
  orderingEnabled: true,
  deliveryEnabled: true,
  deliveryFee: 0,
  freeDeliveryThreshold: 5000,
  taxPercentage: 5,
  currencySymbol: '₹',
  announcement: '✦ Annual Bumper Offer: Special wholesale bulk pricing on winter school sweaters & pullovers ✦ Pan-India transport dispatch ✦',
  announcementEnabled: true,
  promoCode: 'VWWSEASON',
  promoDiscount: 15,
  heroTitle: "India's Trusted Uniforms & Winter Knitwear Manufacturer",
  heroSubtitle: 'Specialized institutional apparel manufacturing from Ludhiana, Punjab. High-grade acrylic-wool sweaters, blazers, and custom school uniforms.',
  heroBadge: 'ESTD. LUDHIANA · GST: 03AWNPV3468J1ZX · MSME UDYAM CERTIFIED',
  reservationMaxGuests: 500
};
