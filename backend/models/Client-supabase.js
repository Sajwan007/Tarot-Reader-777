const supabase = require('../config/supabase');

class Client {
  static async create(clientData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding client:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding client by email:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_booking', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error finding clients:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  static async upsert(clientData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .upsert(clientData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting client:', error);
      throw error;
    }
  }
}

module.exports = Client;
