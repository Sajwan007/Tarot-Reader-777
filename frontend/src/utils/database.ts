import { supabase, localStorageFallback, Database } from './supabase';
import { DatabaseError } from './errorHandler';

// Database service with fallback to localStorage
export class DatabaseService {
  private static instance: DatabaseService;
  
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private isSupabaseAvailable(): boolean {
    return supabase !== null;
  }

  // Booking operations
  async createBooking(bookingData: Database['public']['Tables']['bookings']['Insert']) {
    try {
      if (this.isSupabaseAvailable()) {
        try {
          const { data, error } = await supabase!
            .from('bookings')
            .insert(bookingData)
            .select()
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          console.error('Supabase error, falling back to localStorage:', error);
          return await localStorageFallback.createBooking(bookingData);
        }
      } else {
        return await localStorageFallback.createBooking(bookingData);
      }
    } catch (error) {
      throw new DatabaseError('Failed to create booking', error);
    }
  }

  async getBooking(bookingId: string) {
    try {
      if (this.isSupabaseAvailable()) {
        try {
          const { data, error } = await supabase!
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          console.error('Supabase error, falling back to localStorage:', error);
          return await localStorageFallback.getBooking(bookingId);
        }
      } else {
        return await localStorageFallback.getBooking(bookingId);
      }
    } catch (error) {
      throw new DatabaseError('Failed to retrieve booking', error);
    }
  }

  async updateBooking(bookingId: string, updates: Database['public']['Tables']['bookings']['Update']) {
    try {
      if (this.isSupabaseAvailable()) {
        try {
          const { data, error } = await supabase!
            .from('bookings')
            .update(updates)
            .eq('id', bookingId)
            .select()
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          console.error('Supabase error, falling back to localStorage:', error);
          return await localStorageFallback.updateBooking(bookingId, updates);
        }
      } else {
        return await localStorageFallback.updateBooking(bookingId, updates);
      }
    } catch (error) {
      throw new DatabaseError('Failed to update booking', error);
    }
  }

  // Payment operations
  async createPayment(paymentData: Database['public']['Tables']['payments']['Insert']) {
    try {
      if (this.isSupabaseAvailable()) {
        try {
          const { data, error } = await supabase!
            .from('payments')
            .insert(paymentData)
            .select()
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          console.error('Supabase error, falling back to localStorage:', error);
          return await localStorageFallback.createPayment(paymentData);
        }
      } else {
        return await localStorageFallback.createPayment(paymentData);
      }
    } catch (error) {
      throw new DatabaseError('Failed to create payment', error);
    }
  }

  async getPayment(paymentId: string) {
    try {
      if (this.isSupabaseAvailable()) {
        try {
          const { data, error } = await supabase!
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .single();

          if (error) throw error;
          return data;
        } catch (error) {
          console.error('Supabase error, checking localStorage:', error);
          const data = localStorage.getItem(`payment_${paymentId}`);
          return data ? JSON.parse(data) : null;
        }
      } else {
        const data = localStorage.getItem(`payment_${paymentId}`);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      throw new DatabaseError('Failed to retrieve payment', error);
    }
  }
}

export const db = DatabaseService.getInstance();
