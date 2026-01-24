-- Supabase SQL Schema for Reader777 Tarot App
-- Run this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  reading_type TEXT NOT NULL,
  question TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')),
  payment_id TEXT,
  order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT NOT NULL UNIQUE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_signature TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in paise
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings table
-- Allow anonymous users to insert bookings (for creating new bookings)
CREATE POLICY "Allow anonymous insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to view their own bookings
CREATE POLICY "Allow anonymous view own bookings" ON bookings
  FOR SELECT USING (customer_email = auth.email() OR auth.email() IS NULL);

-- Allow anonymous users to update their own bookings
CREATE POLICY "Allow anonymous update own bookings" ON bookings
  FOR UPDATE USING (customer_email = auth.email() OR auth.email() IS NULL);

-- Create policies for payments table
-- Allow anonymous users to insert payments (for creating new payments)
CREATE POLICY "Allow anonymous insert payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to view payments related to their bookings
CREATE POLICY "Allow anonymous view own payments" ON payments
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_email = auth.email() OR auth.email() IS NULL
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for booking summaries
CREATE OR REPLACE VIEW booking_summary AS
SELECT 
  b.id,
  b.customer_name,
  b.customer_email,
  b.service_name,
  b.service_price,
  b.booking_date,
  b.booking_time,
  b.reading_type,
  b.status,
  p.razorpay_payment_id,
  p.amount,
  p.currency,
  b.created_at
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id
ORDER BY b.created_at DESC;
