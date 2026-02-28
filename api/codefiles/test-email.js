import { testEmailService } from './utils/emailService.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return testEmailService()
      .then(result => {
        res.json({
          success: result,
          message: result ? 'Email service is working correctly' : 'Email service configuration failed',
          environment: {
            EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
            ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          error: error.message,
          environment: {
            EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
            EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
            ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
          }
        });
      });
  }

  res.json({ message: 'Email test API - Use GET to test email configuration' });
}
