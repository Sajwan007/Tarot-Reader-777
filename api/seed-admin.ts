import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const { data, error } = await supabase
      .from('admins')
      .insert({
        email: 'admin@tarot777.com',
        password_hash: hashedPassword,
        name: 'Admin User',
        role: 'admin'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin:', error);
      return;
    }

    console.log('Admin user created successfully:', data);
    console.log('Login credentials:');
    console.log('Email: admin@tarot777.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();
