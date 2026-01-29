import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { testEmailService, sendBookingConfirmation, sendContactNotification } from './utils/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Login endpoint (mirrors the auth/login.ts logic)
app.post('/api/auth/login', async (req, res) => {
  // Set CORS headers for Vercel compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('Login request received');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Raw body:', req.rawBody);
  
  try {
    const { email, password } = req.body;

    console.log('Extracted email:', email);
    console.log('Extracted password:', password ? '***' : 'undefined');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find admin by email
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          last_login: admin.last_login
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookings endpoint
app.get('/api/bookings', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        clients (*),
        services (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json({ 
      success: true, 
      data: { data: data || [] }
    });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rate limiting for contact form (in-memory store for development)
const contactSubmissions = new Map(); // email -> { count, lastSubmission }

const checkRateLimit = (email) => {
  const now = Date.now();
  const submission = contactSubmissions.get(email);
  
  if (!submission) {
    contactSubmissions.set(email, { count: 1, lastSubmission: now });
    return true;
  }
  
  // Reset if more than 1 hour has passed
  if (now - submission.lastSubmission > 60 * 60 * 1000) {
    contactSubmissions.set(email, { count: 1, lastSubmission: now });
    return true;
  }
  
  // Check if exceeded limit (max 3 submissions per hour)
  if (submission.count >= 3) {
    return false;
  }
  
  // Increment count
  submission.count++;
  submission.lastSubmission = now;
  return true;
};

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('Contact request received:', req.body);
  
  try {
    const { name, email, phone, reason, preferredContact, message } = req.body;
    
    console.log('Extracted data:', { name, email, phone, reason, preferredContact, message });
    
    // Basic validation
    if (!name || !email || !reason || !preferredContact || !message) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        success: false, 
        error: 'All required fields must be filled' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - invalid email:', email);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }
    
    // Rate limiting
    if (!checkRateLimit(email)) {
      console.log('Rate limit exceeded for:', email);
      return res.status(429).json({ 
        success: false, 
        error: 'Too many submissions. Please try again later.' 
      });
    }
    
    // Bot detection (honeypot field)
    if (req.body.bot_field || req.body.confirmation) {
      console.log('Bot detected');
      return res.status(400).json({ 
        success: false, 
        error: 'Bot detected' 
      });
    }
    
    console.log('Validation passed, saving to database...');
    
    // Save to database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        reason,
        preferred_contact: preferredContact,
        message: message.trim(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.log('Database error:', error);
      throw error;
    }
    
    console.log('Saved successfully:', data);
    
    // Send email notification to admin (async, don't wait)
    sendContactNotification({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : 'Not provided',
      reason,
      preferredContact,
      message: message.trim()
    }).catch(emailError => {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    });
    
    res.json({
      success: true,
      data: {
        message: 'Contact form submitted successfully',
        submission: data
      }
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit contact form' 
    });
  }
});

// Get contact submissions for admin
app.get('/api/contact', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: { submissions: data || [] }
    });
    
  } catch (error) {
    console.error('Get contact submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Email test endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const isConfigured = await testEmailService();
    
    if (isConfigured) {
      // Send a test email
      await sendContactNotification({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        reason: 'Testing',
        preferredContact: 'email',
        message: 'This is a test email to verify the email service is working correctly.'
      });
      
      res.json({ 
        success: true, 
        message: 'Email service is configured and test email sent successfully!',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Email service configuration failed' 
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`📅 Bookings endpoint: http://localhost:${PORT}/api/bookings`);
  console.log(`📧 Email test: http://localhost:${PORT}/api/test-email`);
  console.log(`\n📝 Note: This is for local development only`);
  console.log(`🚀 For production, Vercel will use the .ts files directly`);
});
