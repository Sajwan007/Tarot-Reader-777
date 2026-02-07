import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
          message: 'Missing required fields: name, email, message are required'
        });
      }
      
      // Log environment variables (without exposing secrets)
      console.log('Environment check:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        NODE_ENV: process.env.NODE_ENV
      });
      
      // Create transporter with error handling
      let transporter;
      try {
        transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          },
          // Add timeout and connection settings
          timeout: 60000,
          connectionTimeout: 60000,
          greetingTimeout: 30000,
          socketTimeout: 60000
        });
        
        // Verify connection
        await transporter.verify();
        console.log('✅ Email transporter created and verified');
      } catch (transportError) {
        console.error('❌ Transporter creation failed:', transportError);
        throw new Error(`Email configuration error: ${transportError.message}`);
      }

      // Create email content
      const mailOptions = {
        from: `"Tarot Reader 777" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Form: ${name}`,
        text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Reason: ${reason || 'Not specified'}
Preferred Contact: ${preferredContact || 'Not specified'}

Message:
${message}

---
Sent: ${new Date().toLocaleString()}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8B5CF6; margin: 0;">✨ Tarot Reader 777</h1>
              <p style="color: #666; margin: 5px 0;">New Contact Form Submission</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Contact Details:</h3>
              <div style="line-height: 1.6;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
                <p><strong>Preferred Contact:</strong> ${preferredContact || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #fff; padding: 10px; border-radius: 5px; border-left: 3px solid #8B5CF6;">${message}</div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; margin: 0;">Received: ${new Date().toLocaleString()}</p>
            </div>
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
        error: error.message
      });
    }
  }

  res.json({ message: 'Contact API - Use POST to submit contact form' });
}
