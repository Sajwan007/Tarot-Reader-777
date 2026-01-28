import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
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
    // Only require authentication for payment verification, not QR generation
    if (req.method === 'POST') {
      const decoded = verifyToken(req);
      (req as any).user = decoded;
      return await verifyPayment(req, res);
    } else if (req.method === 'GET') {
      return await generateQRCode(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.error('Payments API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function generateQRCode(req: VercelRequest, res: VercelResponse) {
  const { booking_id } = req.query;

  if (!booking_id) {
    return res.status(400).json({ error: 'Booking ID required' });
  }

  try {
    // Get booking details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(name, email),
        service:services(name, price)
      `)
      .eq('id', booking_id)
      .single();

    if (error || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Generate UPI payment string
    const upiId = process.env.PAYMENT_UPI_ID;
    const amount = booking.service.price;
    const transactionNote = `Tarot Reading - ${booking.client.name}`;

    const upiString = `upi://pay?pa=${upiId}&pn=Tarot%20Reader%20777&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(upiString);

    // Update booking with payment QR info
    await supabase
      .from('bookings')
      .update({
        payment_upi_id: upiId,
        payment_qr_generated: true,
        payment_qr_expires_at: new Date(Date.now() + (process.env.PAYMENT_QR_VALIDITY_HOURS ? parseInt(process.env.PAYMENT_QR_VALIDITY_HOURS) * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString()
      })
      .eq('id', booking_id);

    res.json({
      qrCode: qrCodeDataURL,
      upiString,
      amount,
      upiId,
      expiresAt: new Date(Date.now() + (process.env.PAYMENT_QR_VALIDITY_HOURS ? parseInt(process.env.PAYMENT_QR_VALIDITY_HOURS) * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString()
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}

async function verifyPayment(req: VercelRequest, res: VercelResponse) {
  const { booking_id, transaction_id, payment_method = 'upi' } = req.body;

  if (!booking_id || !transaction_id) {
    return res.status(400).json({ error: 'Booking ID and transaction ID required' });
  }

  try {
    // Get booking details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (error || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.payment_status === 'verified') {
      return res.status(400).json({ error: 'Payment already verified' });
    }

    // In a real implementation, you would verify the transaction with the payment gateway
    // For now, we'll assume the transaction is valid if provided
    // TODO: Integrate with actual UPI payment verification API

    // Update booking payment status
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'verified',
        payment_transaction_id: transaction_id,
        payment_verified_at: new Date().toISOString(),
        payment_verified_by: (req as any).user.id,
        status: 'confirmed'
      })
      .eq('id', booking_id)
      .select(`
        *,
        client:clients(name, email),
        service:services(name, price)
      `)
      .single();

    if (updateError) {
      console.error('Error updating payment status:', updateError);
      return res.status(500).json({ error: 'Failed to verify payment' });
    }

    // Send payment confirmation email
    await sendPaymentConfirmationEmail(updatedBooking);

    res.json({
      message: 'Payment verified successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}

async function sendPaymentConfirmationEmail(booking: any) {
  // This would integrate with SendGrid
  // For now, we'll just log the email
  console.log(`Sending payment confirmation email to ${booking.client.email} for booking ${booking.id}`);
  
  // TODO: Implement SendGrid email sending
  // You would use the SendGrid API here to send actual emails
}
