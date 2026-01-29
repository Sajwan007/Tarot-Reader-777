import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

// Create email transporter
const createTransporter = () => {
  // Use Gmail for development (you can change this for production)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Add SSL configuration for development
    tls: {
      rejectUnauthorized: false
    },
    // Add connection timeout
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
  });

  return transporter;
};

// Send booking confirmation email
export const sendBookingConfirmation = async (clientEmail, bookingDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'Booking Confirmed - Tarot Reader 777',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; margin: 0;">✨ Tarot Reader 777</h1>
            <p style="color: #666; margin: 5px 0;">Your mystical journey awaits</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0;">Booking Confirmed!</h2>
            <p style="margin: 0; font-size: 18px;">Thank you for choosing Tarot Reader 777</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Booking Details:</h3>
            <div style="line-height: 1.6;">
              <p><strong>Service:</strong> ${bookingDetails.service}</p>
              <p><strong>Date:</strong> ${bookingDetails.date}</p>
              <p><strong>Time:</strong> ${bookingDetails.time}</p>
              <p><strong>Duration:</strong> ${bookingDetails.duration} minutes</p>
              <p><strong>Price:</strong> ₹${bookingDetails.price}</p>
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please complete your payment to confirm your booking. Payment instructions will be sent separately.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin: 0;">If you have any questions, feel free to contact us:</p>
            <p style="color: #666; margin: 5px 0;">📧 info@tarotreader777.com</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; margin: 0; font-size: 12px;">© 2026 Tarot Reader 777. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }
};

// Send payment confirmation email
export const sendPaymentConfirmation = async (clientEmail, paymentDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'Payment Confirmed - Tarot Reader 777',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; margin: 0;">✨ Tarot Reader 777</h1>
            <p style="color: #666; margin: 5px 0;">Your mystical journey awaits</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; color: white; margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0;">Payment Confirmed!</h2>
            <p style="margin: 0; font-size: 18px;">Your booking is now fully confirmed</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Payment Details:</h3>
            <div style="line-height: 1.6;">
              <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
              <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
              <p><strong>Payment Method:</strong> ${paymentDetails.method}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
            <p style="margin: 0; color: #0c5460;"><strong>Next Steps:</strong> We will send you a reminder 24 hours before your scheduled reading. Please make sure you're available at the scheduled time.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin: 0;">We look forward to guiding you on your mystical journey!</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; margin: 0; font-size: 12px;">© 2026 Tarot Reader 777. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
    throw error;
  }
};

// Send contact form notification
export const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Contact Form Submission - Tarot Reader 777',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; margin: 0;">✨ Tarot Reader 777</h1>
            <p style="color: #666; margin: 5px 0;">New Contact Form Submission</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">Contact Details:</h3>
            <div style="line-height: 1.6;">
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
              <p><strong>Reason:</strong> ${contactData.reason}</p>
              <p><strong>Preferred Contact:</strong> ${contactData.preferredContact}</p>
              <p><strong>Message:</strong></p>
              <p style="background: #fff; padding: 10px; border-radius: 5px; border-left: 3px solid #8B5CF6;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin: 0;">Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending contact notification:', error);
    throw error;
  }
};

// Test email configuration
export const testEmailService = async () => {
  try {
    console.log('Testing email service...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS not set in environment variables');
    }
    
    const transporter = createTransporter();
    
    console.log('Attempting to verify email connection...');
    await transporter.verify();
    console.log('✅ Email service is configured correctly');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide specific guidance for common Gmail errors
    if (error.code === 'EAUTH') {
      console.error('🔧 Gmail Authentication Fix:');
      console.error('1. Enable 2-Factor Authentication on your Gmail account');
      console.error('2. Generate an App Password: https://myaccount.google.com/apppasswords');
      console.error('3. Use the 16-character App Password (not your regular password)');
    } else if (error.code === 'ECONNECTION') {
      console.error('🔧 Connection Fix:');
      console.error('1. Check your internet connection');
      console.error('2. Verify Gmail service is available');
      console.error('3. Try again in a few moments');
    }
    
    return false;
  }
};
