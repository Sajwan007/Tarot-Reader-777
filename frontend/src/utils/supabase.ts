import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using localStorage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          service_id: string;
          service_name: string;
          service_price: string;
          booking_date: string;
          booking_time: string;
          reading_type: string;
          question?: string;
          status: 'pending' | 'paid' | 'completed' | 'cancelled';
          payment_id?: string;
          order_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Row']>;
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
          amount: number;
          currency: string;
          status: 'pending' | 'success' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Row']>;
      };
    };
  };
}

// Fallback functions for when Supabase is not available
export const localStorageFallback = {
  async createBooking(bookingData: any) {
    const bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    const booking = {
      id: bookingId,
      ...bookingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(booking));
    return booking;
  },

  async getBooking(bookingId: string) {
    const data = localStorage.getItem(`booking_${bookingId}`);
    return data ? JSON.parse(data) : null;
  },

  async updateBooking(bookingId: string, updates: any) {
    const existing = await this.getBooking(bookingId);
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  async createPayment(paymentData: any) {
    const payment = {
      id: paymentData.razorpay_payment_id,
      ...paymentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(`payment_${paymentData.razorpay_payment_id}`, JSON.stringify(payment));
    return payment;
  }
};
