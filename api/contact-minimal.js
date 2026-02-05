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
      console.log('=== Contact Form Submission ===');
      console.log('Request body:', req.body);
      
      const { name, email, phone, reason, preferredContact, message } = req.body;
      
      // Log environment variables (without exposing secrets)
      console.log('Environment check:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        NODE_ENV: process.env.NODE_ENV
      });
      
      // For now, just return success without sending email
      console.log('✅ Contact form received successfully');
      
      return res.json({
        success: true,
        message: 'Contact form received! We will get back to you soon.',
        data: { name, email, reason, preferredContact },
        emailSent: false, // Will enable after debugging
        debug: {
          received: req.body,
          envSet: {
            EMAIL_USER: !!process.env.EMAIL_USER,
            EMAIL_PASS: !!process.env.EMAIL_PASS,
            ADMIN_EMAIL: !!(process.env.ADMIN_EMAIL || process.env.EMAIL_USER)
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Contact form error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to process contact form. Please try again.',
        error: error.message,
        debug: {
          envSet: {
            EMAIL_USER: !!process.env.EMAIL_USER,
            EMAIL_PASS: !!process.env.EMAIL_PASS,
            ADMIN_EMAIL: !!(process.env.ADMIN_EMAIL || process.env.EMAIL_USER)
          }
        }
      });
    }
  }

  res.json({ message: 'Contact API - Use POST to submit contact form' });
}
