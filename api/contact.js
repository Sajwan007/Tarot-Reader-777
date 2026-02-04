import { sendContactNotification } from './utils/emailService.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email, phone, reason, preferredContact, message } = req.body;
    
    // Send email notification (wait for completion)
    try {
      await sendContactNotification({
        name: name?.trim() || 'Unknown',
        email: email?.toLowerCase().trim() || 'unknown@example.com',
        phone: phone?.trim() || 'Not provided',
        reason: reason || 'Not specified',
        preferredContact: preferredContact || 'Not specified',
        message: message?.trim() || 'No message provided'
      });
      console.log('✅ Contact notification email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send notification email:', emailError);
      console.error('Environment check:', {
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
      });
      // Still return success but log the error
    }
    
    return res.json({
      success: true,
      message: 'Contact form received! We will get back to you soon.',
      data: { name, email, reason, preferredContact }
    });
  }

  res.json({ message: 'Contact API is working!' });
}
