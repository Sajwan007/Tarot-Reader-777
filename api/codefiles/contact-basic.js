export default async function handler(req, res) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('=== BASIC CONTACT TEST ===');
      console.log('Method:', req.method);
      console.log('Headers:', JSON.stringify(req.headers));
      console.log('Body:', JSON.stringify(req.body));
      
      // Just return success without email for now
      return res.json({
        success: true,
        message: 'Basic contact test - working!',
        received: {
          method: req.method,
          body: req.body,
          env: {
            email_user: process.env.EMAIL_USER ? 'SET' : 'NOT_SET',
            email_pass: process.env.EMAIL_PASS ? 'SET' : 'NOT_SET',
            admin_email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
          }
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('BASIC ERROR:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Basic test failed',
        error: error.message
      });
    }
  }

  res.json({ 
    message: 'Basic contact API - POST to test',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
