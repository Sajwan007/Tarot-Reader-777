export const SERVICES = [
  { id: 'love', name: 'Love Tarot', duration: '30 min', price: 50 },
  { id: 'career', name: 'Career Tarot', duration: '30 min', price: 50 },
  { id: 'general', name: 'General Reading', duration: '45 min', price: 75 },
  { id: 'three-card', name: '3-Card Spread', duration: '20 min', price: 35 },
  { id: 'celtic-cross', name: 'Celtic Cross', duration: '60 min', price: 100 }
];

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const USER_TYPES = {
  ADMIN: 'admin',
  CLIENT: 'client'
};

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  BOOKINGS: '/bookings',
  CLIENTS: '/clients',
  ADMIN: '/admin'
};

export const ROUTES = {
  LOGIN: '/login',
  ADMIN: '/admin',
  BOOKING: '/booking',
  DASHBOARD: '/admin/dashboard',
  CALENDAR: '/admin/calendar',
  CLIENTS: '/admin/clients',
  BOOKINGS: '/admin/bookings'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  BOOKING_DRAFT: 'booking_draft'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
