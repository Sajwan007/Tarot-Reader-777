const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

class Admin {
  static async create(adminData) {
    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      const { data, error } = await supabase
        .from('admins')
        .insert([{ ...adminData, password: hashedPassword }])
        .select()
        .single();

      if (error) throw error;
      // Remove password from response
      const { password, ...adminWithoutPassword } = data;
      return adminWithoutPassword;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding admin:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding admin by email:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, email, name, role, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error finding admins:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      // If password is being updated, hash it
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      const { data, error } = await supabase
        .from('admins')
        .update(updateData)
        .eq('id', id)
        .select('id, email, name, role, created_at, updated_at')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error validating password:', error);
      throw error;
    }
  }
}

module.exports = Admin;
