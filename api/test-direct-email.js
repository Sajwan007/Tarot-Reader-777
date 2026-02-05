import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('Testing direct email send...');
      
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: '🔧 Direct Email Test - Tarot Reader 777',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #8B5CF6;">Direct Email Test</h2>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>To:</strong> ${process.env.EMAIL_USER}</p>
            <p style="color: green;">✅ This is a test email from Vercel function</p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Direct test email sent:', result.messageId);
      
      res.json({
        success: true,
        message: 'Direct test email sent successfully',
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Direct email test failed:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        code: error.code
      });
    }
  }

  res.json({ message: 'Use GET to test direct email sending' });
}
