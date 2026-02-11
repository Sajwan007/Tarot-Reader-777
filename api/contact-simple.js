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
      
      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, email, message are required',
          received: { name, email, phone, reason, preferredContact, message }
        });
      }
      
      // Log environment variables (without exposing secrets)
      console.log('Environment check:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        NODE_ENV: process.env.NODE_ENV
      });
      
      // Simple email sending using nodemailer directly
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: 'New Contact Form - Tarot Reader 777',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #8B5CF6;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContact || 'Not specified'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</div>
            <hr>
            <p><small>Sent: ${new Date().toLocaleString()}</small></p>
          </div>
        `
      };

      console.log('Sending email...');
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      
      return res.json({
        success: true,
        message: 'Contact form received! We will get back to you soon.',
        data: { name, email, reason, preferredContact },
        emailSent: true,
        messageId: result.messageId
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
        message: 'Failed to send email. Please try again.',
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
