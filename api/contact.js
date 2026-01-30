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
      const { name, email, phone, reason, preferredContact, message } = req.body;
      
      // Validation
      if (!name || !email || !reason || !preferredContact || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'All required fields must be filled' 
        });
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email address' 
        });
      }
      
      // Bot detection
      if (req.body.bot_field || req.body.confirmation) {
        return res.status(400).json({ 
          success: false, 
          error: 'Bot detected' 
        });
      }
      
      // For now, just return success without database
      // TODO: Add database integration later
      console.log('Contact form submission:', {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        reason,
        preferredContact,
        message: message.trim(),
        timestamp: new Date().toISOString()
      });
      
      return res.json({
        success: true,
        data: {
          message: 'Contact form submitted successfully',
          submission: { name, email, reason, preferredContact }
        }
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to submit contact form' 
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
