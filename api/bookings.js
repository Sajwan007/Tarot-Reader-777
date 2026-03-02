import { supabase } from './utils/supabaseClient.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!supabase) {
    console.error('Supabase is not configured for bookings handler');
    return res.status(500).json({
      success: false,
      error: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  try {
    if (req.method === 'GET') {
      // Stats mode: /api/bookings?stats=1
      if (req.query.stats) {
        const { data, error } = await supabase
          .from('bookings')
          .select('status,payment_status,price');

        if (error) {
          console.error('Error fetching booking stats:', error);
          return res.status(500).json({ success: false, error: 'Failed to load booking stats' });
        }

        const totalBookings = data.length;
        const confirmed = data.filter((b) => b.status === 'confirmed').length;
        const pending = data.filter((b) => b.status === 'pending').length;
        const revenue = data
          .filter((b) => b.payment_status === 'paid')
          .reduce((sum, b) => sum + (b.price || 0), 0);

        return res.status(200).json({
          success: true,
          data: { totalBookings, confirmed, pending, revenue },
        });
      }

      // List bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ success: false, error: 'Failed to load bookings' });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    }

    if (req.method === 'POST') {
      const payload = {
        ...req.body,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ success: false, error: 'Failed to create booking' });
      }

      return res.status(201).json({
        success: true,
        data,
      });
    }

    if (req.method === 'PUT') {
      const bookingId = req.query.id;
      if (!bookingId) {
        return res.status(400).json({ success: false, error: 'Missing booking id' });
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(req.body)
        .eq('id', bookingId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({ success: false, error: 'Failed to update booking' });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    }

    if (req.method === 'DELETE') {
      const bookingId = req.query.id;
      if (!bookingId) {
        return res.status(400).json({ success: false, error: 'Missing booking id' });
      }

      const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

      if (error) {
        console.error('Error deleting booking:', error);
        return res.status(500).json({ success: false, error: 'Failed to delete booking' });
      }

      return res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
      });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Unexpected error in bookings handler:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
