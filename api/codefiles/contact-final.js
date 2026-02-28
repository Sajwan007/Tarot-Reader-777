export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('=== FINAL CONTACT TEST ===');
      console.log('Method:', req.method);
      console.log('Headers:', JSON.stringify(req.headers));
      console.log('Body:', JSON.stringify(req.body));
      
      const { name, email, phone, reason, preferredContact, message } = req.body;
      
      // Log ALL environment variables for debugging
      console.log('ALL ENVIRONMENT VARIABLES:', {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'SET' : 'NOT_SET',
        EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT_SET',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT_SET',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        NODE_ENV: process.env.NODE_ENV || 'development'
      });
      
      // Simple success response - NO EMAIL SENDING
      console.log('✅ Contact form processed successfully - NO EMAIL SENT');
      
      return res.json({
        success: true,
        message: 'Contact form received! (Email service disabled for testing)',
        received: {
          name: name,
          email: email,
          phone: phone,
          reason: reason,
          preferredContact: preferredContact,
          message: message
        },
        environment: process.env.NODE_ENV || 'development',
        debug: {
          allEnvVars: {
            SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
            EMAIL_USER: !!process.env.EMAIL_USER,
            EMAIL_PASS: !!process.env.EMAIL_PASS,
            ADMIN_EMAIL: !!(process.env.ADMIN_EMAIL || process.env.EMAIL_USER)
          }
        }
      });
      
    } catch (error) {
      console.error('FINAL CONTACT ERROR:', error.message);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to process contact form',
        error: error.message,
        environment: process.env.NODE_ENV || 'development'
      });
    }
  }

  res.json({ 
    message: 'Final contact API - POST to submit',
    timestamp: new Date().toISOString()
  });
}
