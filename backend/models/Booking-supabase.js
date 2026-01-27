const supabase = require('../config/supabase');

class Booking {
  static async create(bookingData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding booking:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabase.from('bookings').select('*');

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.date) {
        query = query.eq('date', filters.date);
      }

      if (filters.search) {
        query = query.or(`clientName.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error finding bookings:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('status, price');

      if (error) throw error;

      const stats = {
        totalBookings: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        revenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.price || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
}

module.exports = Booking;
