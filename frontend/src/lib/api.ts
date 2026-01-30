import axios from 'axios';

// Dynamic API base URL for Vercel deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', credentials);
    return response;
  },
  
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response;
  },
};

// Bookings API
export const bookingsAPI = {
  getBookings: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/bookings', { params });
    return response;
  },
  
  getAll: async () => {
    const response = await api.get('/api/bookings');
    return response;
  },
  
  getStats: async () => {
    const response = await api.get('/api/bookings/stats');
    return response;
  },
  
  create: async (bookingData: any) => {
    const response = await api.post('/api/bookings', bookingData);
    return response;
  },
  
  update: async (id: string, updates: any) => {
    const response = await api.put(`/api/bookings?id=${id}`, updates);
    return response;
  },
  
  updateBooking: async (id: string, updates: any) => {
    const response = await api.put(`/api/bookings?id=${id}`, updates);
    return response;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/api/bookings?id=${id}`);
    return response;
  },
};

// Services API
export const servicesAPI = {
  getServices: async () => {
    const response = await api.get('/api/services');
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  generateQR: async (bookingId: string) => {
    const response = await api.get(`/api/payments/verify?booking_id=${bookingId}`);
    return response;
  },
  
  verifyPayment: async (data: { booking_id: string; transaction_id: string; payment_method?: string }) => {
    const response = await api.post('/api/payments/verify', data);
    return response;
  },
};

// Clients API
export const clientsAPI = {
  getClients: async () => {
    const response = await api.get('/api/clients');
    return response;
  },
  
  getAll: async () => {
    const response = await api.get('/api/clients');
    return response;
  },
  
  createClient: async (clientData: any) => {
    const response = await api.post('/api/clients', clientData);
    return response;
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (contactData: any) => {
    const response = await api.post('/api/contact', contactData);
    return response;
  },
  
  getSubmissions: async () => {
    const response = await api.get('/api/contact');
    return response;
  }
};

// Availability API
export const availabilityAPI = {
  getAvailability: async (params?: { date?: string; admin_id?: string }) => {
    const response = await api.get('/api/availability', { params });
    return response.data;
  },
  
  createAvailability: async (availabilityData: any) => {
    const response = await api.post('/api/availability', availabilityData);
    return response;
  },
  
  updateAvailability: async (id: string, updates: any) => {
    const response = await api.put(`/api/availability?id=${id}`, updates);
    return response;
  },
};
