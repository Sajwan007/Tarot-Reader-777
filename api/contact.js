import { sendContactNotification } from './utils/emailService.js';
import { supabase } from './utils/supabaseClient.js';

// Basic in-memory rate limiting (per Lambda instance)
const rateLimit = {};
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Error fetching contact submissions from Supabase:', error);
          return res.status(500).json({ success: false, error: 'Failed to fetch submissions' });
        }

        return res.status(200).json({
          success: true,
          data: { submissions: data || [] }
        });
      }

      // If Supabase is not configured, return empty list
      return res.status(200).json({
        success: true,
        data: { submissions: [] }
      });
    } catch (err) {
      console.error('Unexpected error in GET /api/contact:', err);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { name, email, phone, reason, preferredContact, message, bot_field } = req.body || {};

    // Honeypot field: if filled, silently accept but do nothing
    if (bot_field) {
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message.'
      });
    }

    // Simple rate limit by IP
    const ip =
      (req.headers['x-forwarded-for']?.split(',')[0] || '').trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const entry = rateLimit[ip] || { count: 0, start: now };

    if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
      rateLimit[ip] = { count: 1, start: now };
    } else {
      entry.count += 1;
      rateLimit[ip] = entry;
      if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please try again later.'
        });
      }
    }

    const submission = {
      name: name?.trim() || 'Unknown',
      email: email?.toLowerCase().trim() || 'unknown@example.com',
      phone: phone?.trim() || 'Not provided',
      reason: reason || 'not_specified',
      preferred_contact: preferredContact || 'not_specified',
      message: message?.trim() || 'No message provided'
    };

    // Persist to Supabase if configured
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .insert(submission)
          .select('*')
          .single();

        if (error) {
          console.error('Error saving contact submission to Supabase:', error);
        } else if (data) {
          submission.id = data.id;
          submission.created_at = data.created_at;
        }
      } catch (dbError) {
        console.error('Unexpected error inserting contact submission:', dbError);
      }
    }

    try {
      await sendContactNotification({
        ...submission,
        created_at: submission.created_at || new Date().toISOString()
      });
      console.log('✅ Contact notification email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send notification email:', emailError);
      console.error('Environment check:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
      });
      // Still return success but log the error
    }

    return res.json({
      success: true,
      message: 'Contact form received! We will get back to you soon.',
      data: {
        name: submission.name,
        email: submission.email,
        reason: submission.reason,
        preferredContact: submission.preferred_contact
      }
    });
  }

  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
