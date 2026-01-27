const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  // Don't exit, just create a dummy client for health check
  module.exports = null;
  return;
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
