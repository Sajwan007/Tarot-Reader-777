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
      console.log('=== CONTACT TEST - NO EMAIL ===');
      console.log('Method:', req.method);
      console.log('Headers:', JSON.stringify(req.headers));
      console.log('Body:', JSON.stringify(req.body));
      
      const { name, email, phone, reason, preferredContact, message } = req.body;
      
      // Just return success - NO EMAIL SENDING
      console.log('✅ Form processed successfully - NO EMAIL SENT');
      
      return res.json({
        success: true,
        message: 'Contact form received successfully! (No email sent)',
        received: {
          name: name,
          email: email,
          phone: phone,
          reason: reason,
          preferredContact: preferredContact,
          message: message
        },
        timestamp: new Date().toISOString(),
        environment: 'no-email-test'
      });
      
    } catch (error) {
      console.error('CONTACT TEST ERROR:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Test failed',
        error: error.message
      });
    }
  }

  res.json({ 
    message: 'Contact test API - POST to test (no email)',
    timestamp: new Date().toISOString()
  });
}
