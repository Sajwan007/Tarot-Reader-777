-- Tarot Reader 777 Database Schema
-- Complete database structure for the Tarot booking application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Clients table
CREATE TABLE clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table (types of tarot readings)
CREATE TABLE services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
    payment_upi_id VARCHAR(255),
    payment_transaction_id VARCHAR(255),
    payment_verified_at TIMESTAMP WITH TIME ZONE,
    payment_verified_by UUID REFERENCES admins(id),
    notes TEXT,
    meeting_link VARCHAR(500),
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability table (admin availability)
CREATE TABLE availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(admin_id, date, start_time)
);

-- Email logs table
CREATE TABLE email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    booking_id UUID REFERENCES bookings(id),
    metadata JSONB
);

-- Settings table (app configuration)
CREATE TABLE settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (name, description, duration_minutes, price) VALUES
('General Tarot Reading', 'A comprehensive tarot reading covering all aspects of life', 60, 50.00),
('Love & Relationships', 'Focused reading on love, relationships, and compatibility', 45, 40.00),
('Career & Finance', 'Career guidance and financial insights through tarot', 45, 40.00),
('Quick Question', 'One specific question answered with 3-card spread', 20, 20.00),
('Monthly Guidance', 'Detailed monthly forecast with tarot insights', 90, 80.00);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('app_name', 'Tarot Reader 777', 'Application name'),
('booking_advance_days', '7', 'Maximum days in advance for bookings'),
('payment_qr_validity_hours', '24', 'QR code validity in hours'),
('reminder_hours_before', '2', 'Hours before booking to send reminder'),
('admin_email', 'admin@tarot777.com', 'Default admin email'),
('currency', 'USD', 'Default currency'),
('timezone', 'UTC', 'Default timezone');

-- Create indexes for better performance
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_admin_id ON bookings(admin_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX idx_availability_admin_date ON availability(admin_id, date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view all admins" ON admins FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update own profile" ON admins FOR UPDATE USING (auth.email() = email);

-- Client policies
CREATE POLICY "Admins can view all clients" ON clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert clients" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update clients" ON clients FOR UPDATE USING (auth.role() = 'authenticated');

-- Booking policies
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- Availability policies
CREATE POLICY "Admins can manage availability" ON availability FOR ALL USING (auth.role() = 'authenticated');

-- Email logs policies
CREATE POLICY "Admins can view email logs" ON email_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert email logs" ON email_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Settings policies
CREATE POLICY "Admins can view settings" ON settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');
