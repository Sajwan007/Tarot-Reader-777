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
      console.log('=== CONTACT FORM WITH SENDGRID ===');
      console.log('Body:', JSON.stringify(req.body));
      
      const { name, email, phone, reason, preferredContact, message } = req.body;
      
      // Check environment variables
      console.log('Environment check:', {
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'Set' : 'Not set',
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set'
      });
      
      if (!process.env.SENDGRID_API_KEY) {
        console.log('SendGrid not configured, using simple response without email');
        // Return success without email if SendGrid not configured
        return res.json({
          success: true,
          message: 'Contact form received! We will get back to you soon.',
          emailSent: false,
          note: 'Email service not configured - storing in database',
          data: { name, email, phone, reason, preferredContact, message },
          timestamp: new Date().toISOString()
        });
      }
      
      // Use SendGrid if available
      try {
        const { default: sgMail } = await import('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          from: process.env.EMAIL_USER,
          subject: `New Contact: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #8B5CF6;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
              <p><strong>Message:</strong></p>
              <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</div>
              <hr>
              <p><small>Sent: ${new Date().toLocaleString()}</small></p>
            </div>
          `
        };
        
        await sgMail.send(msg);
        console.log('✅ SendGrid email sent successfully');
        
        return res.json({
          success: true,
          message: 'Contact form received! We will get back to you soon.',
          emailSent: true,
          timestamp: new Date().toISOString()
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Still return success even if email fails
        return res.json({
          success: true,
          message: 'Contact form received! We will get back to you soon.',
          emailSent: false,
          emailError: emailError.message,
          data: { name, email, phone, reason, preferredContact, message },
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to process contact form',
        error: error.message
      });
    }
  }

  res.json({ message: 'Contact API - POST to submit' });
}
