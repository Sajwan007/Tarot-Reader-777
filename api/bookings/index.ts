import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { cors } from '../cors';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Middleware to verify JWT token
function verifyToken(req: VercelRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Verify authentication for all routes except POST (create booking)
    if (req.method !== 'POST') {
      const decoded = verifyToken(req);
      (req as any).user = decoded;
    }

    switch (req.method) {
      case 'GET':
        return await getBookings(req, res);
      case 'POST':
        return await createBooking(req, res);
      case 'PUT':
        return await updateBooking(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.error('Bookings API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBookings(req: VercelRequest, res: VercelResponse) {
  const { status, page = 1, limit = 10 } = req.query;
  
  let query = supabase
    .from('bookings')
    .select(`
      *,
      client:clients(name, email, phone),
      service:services(name, duration_minutes, price),
      admin:admins(name, email)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data: bookings, error } = await query
    .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);

  if (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }

  res.json({ bookings });
}

async function createBooking(req: VercelRequest, res: VercelResponse) {
  const {
    client_name,
    client_email,
    client_phone,
    service_id,
    booking_date,
    booking_time,
    notes
  } = req.body;

  if (!client_name || !client_email || !service_id || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Start a transaction
    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single();

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if slot is available
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', booking_date)
      .eq('booking_time', booking_time)
      .neq('status', 'cancelled')
      .single();

    if (existingBooking) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    // Create or find client
    let client;
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', client_email)
      .single();

    if (existingClient) {
      client = existingClient;
    } else {
      const { data: newClient } = await supabase
        .from('clients')
        .insert({
          name: client_name,
          email: client_email,
          phone: client_phone
        })
        .select()
        .single();
      client = newClient;
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        client_id: client.id,
        service_id,
        booking_date,
        booking_time,
        notes,
        status: 'pending',
        payment_status: 'pending'
      })
      .select(`
        *,
        client:clients(name, email, phone),
        service:services(name, duration_minutes, price)
      `)
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    // Send confirmation email
    await sendBookingEmail(booking, 'confirmation');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
}

async function updateBooking(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const updates = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Booking ID required' });
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      client:clients(name, email, phone),
      service:services(name, duration_minutes, price),
      admin:admins(name, email)
    `)
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Failed to update booking' });
  }

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Send email if status changed
  if (updates.status && updates.status !== booking.status) {
    await sendBookingEmail(booking, 'status_update');
  }

  res.json({
    message: 'Booking updated successfully',
    booking
  });
}

async function sendBookingEmail(booking: any, type: string) {
  // This would integrate with SendGrid
  // For now, we'll just log the email
  console.log(`Sending ${type} email to ${booking.client.email} for booking ${booking.id}`);
  
  // TODO: Implement SendGrid email sending
  // You would use the SendGrid API here to send actual emails
}
