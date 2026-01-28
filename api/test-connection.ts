import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from parent directory
dotenv.config({ path: '.env' });

// Test Supabase connectivity
async function testConnection() {
  console.log('Testing Supabase connectivity...');
  
  console.log('Environment variables:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Environment variables not properly set');
    return;
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('✅ Supabase client created');
    console.log('URL:', process.env.SUPABASE_URL);

    // Test basic connection - try to get the current time
    const { data, error } = await supabase
      .from('admins')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('Error details:', error);
      return;
    }

    console.log('✅ Connection successful!');
    console.log('✅ Database accessible');

    // Test if tables exist
    const tables = ['admins', 'clients', 'services', 'bookings'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' error:`, error.message);
        } else {
          console.log(`✅ Table '${table}' accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' failed:`, err);
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

testConnection();
