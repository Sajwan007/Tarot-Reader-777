export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('Contact form data received:', req.body);
      
      const { name, email, phone, reason, preferredContact, message } = req.body;
      
      // Log environment variables (without exposing secrets)
      console.log('Environment check:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        NODE_ENV: process.env.NODE_ENV
      });
      
      return res.json({
        success: true,
        message: 'Contact form received! We will get back to you soon.',
        data: { name, email, reason, preferredContact },
        debug: {
          received: req.body,
          env: {
            EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
            ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
          }
        }
      });
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  res.json({ message: 'Contact API is working!' });
}
