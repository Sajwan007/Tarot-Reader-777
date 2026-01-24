// Dynamic import for SendGrid to avoid SSR issues
let sgMail: any = null;

const initializeSendGrid = async () => {
  if (typeof window !== 'undefined' && !sgMail) {
    try {
      const module = await import('@sendgrid/mail');
      sgMail = module.default;
      
      // Initialize SendGrid (in production, use environment variables)
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      }
    } catch (error) {
      console.error('Failed to load SendGrid:', error);
    }
  }
  return sgMail;
};

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  price: string;
  bookingId: string;
  readingType: string;
  question?: string;
}

export interface PaymentConfirmationData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  price: string;
  bookingId: string;
  paymentId: string;
  orderId: string;
  paidAt: string;
}

// Email Templates
export const getBookingConfirmationTemplate = (data: BookingConfirmationData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Mystical Tarot Reader</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
          color: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 32px;
          color: #D4AF37;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .subtitle {
          color: #cccccc;
          font-size: 16px;
        }
        .booking-details {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .label {
          color: #aaaaaa;
          font-size: 14px;
        }
        .value {
          color: #ffffff;
          font-weight: bold;
        }
        .highlight {
          color: #D4AF37;
          font-size: 18px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #888888;
          font-size: 14px;
        }
        .booking-id {
          background: rgba(212, 175, 55, 0.2);
          padding: 10px 15px;
          border-radius: 8px;
          text-align: center;
          font-family: monospace;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">✨ Booking Confirmed ✨</div>
          <div class="subtitle">Your mystical journey awaits</div>
        </div>

        <p>Dear ${data.customerName},</p>
        
        <p>Your tarot reading session has been successfully booked! We're honored to guide you on your spiritual journey.</p>

        <div class="booking-details">
          <div class="detail-row">
            <span class="label">Service</span>
            <span class="value">${data.serviceName}</span>
          </div>
          <div class="detail-row">
            <span class="label">Date</span>
            <span class="value">${data.date}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time</span>
            <span class="value">${data.time}</span>
          </div>
          <div class="detail-row">
            <span class="label">Reading Type</span>
            <span class="value">${data.readingType}</span>
          </div>
          <div class="detail-row">
            <span class="label">Price</span>
            <span class="value highlight">${data.price}</span>
          </div>
        </div>

        <div class="booking-id">
          <strong>Booking ID:</strong> ${data.bookingId}
        </div>

        ${data.question ? `
        <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <strong>Your Question:</strong><br>
          <em>"${data.question}"</em>
        </div>
        ` : ''}

        <p><strong>What happens next?</strong></p>
        <ul>
          <li>Complete your payment to secure your slot</li>
          <li>You'll receive a payment confirmation email</li>
          <li>We'll send a reminder 24 hours before your session</li>
          <li>Join us at the scheduled time for your reading</li>
        </ul>

        <div class="footer">
          <p>Blessings & Light,<br>Mystical Tarot Reader</p>
          <p style="font-size: 12px; margin-top: 20px;">
            If you have any questions, please don't hesitate to contact us.<br>
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getPaymentConfirmationTemplate = (data: PaymentConfirmationData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Mystical Tarot Reader</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
          color: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .title {
          font-size: 32px;
          color: #D4AF37;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .subtitle {
          color: #cccccc;
          font-size: 16px;
        }
        .payment-details {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 15px 0;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .label {
          color: #aaaaaa;
          font-size: 14px;
        }
        .value {
          color: #ffffff;
          font-weight: bold;
        }
        .highlight {
          color: #D4AF37;
          font-size: 18px;
        }
        .success-badge {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 15px 25px;
          border-radius: 50px;
          text-align: center;
          font-weight: bold;
          margin: 25px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #888888;
          font-size: 14px;
        }
        .booking-id {
          background: rgba(212, 175, 55, 0.2);
          padding: 10px 15px;
          border-radius: 8px;
          text-align: center;
          font-family: monospace;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">💰 Payment Successful 💰</div>
          <div class="subtitle">Your booking is now confirmed</div>
        </div>

        <div class="success-badge">
          ✓ PAYMENT RECEIVED
        </div>

        <p>Dear ${data.customerName},</p>
        
        <p>Thank you for your payment! Your tarot reading session is now fully confirmed. We're excited to provide you with profound insights and guidance.</p>

        <div class="payment-details">
          <div class="detail-row">
            <span class="label">Service</span>
            <span class="value">${data.serviceName}</span>
          </div>
          <div class="detail-row">
            <span class="label">Date</span>
            <span class="value">${data.date}</span>
          </div>
          <div class="detail-row">
            <span class="label">Time</span>
            <span class="value">${data.time}</span>
          </div>
          <div class="detail-row">
            <span class="label">Amount Paid</span>
            <span class="value highlight">${data.price}</span>
          </div>
          <div class="detail-row">
            <span class="label">Payment ID</span>
            <span class="value" style="font-family: monospace; font-size: 12px;">${data.paymentId}</span>
          </div>
        </div>

        <div class="booking-id">
          <strong>Booking ID:</strong> ${data.bookingId}
        </div>

        <p><strong>What's Next?</strong></p>
        <ul>
          <li>Save this email for your records</li>
          <li>You'll receive a reminder 24 hours before your session</li>
          <li>Ensure you have a stable internet connection for online sessions</li>
          <li>Prepare any specific questions you'd like to explore</li>
        </ul>

        <p style="color: #D4AF37; font-weight: bold;">We look forward to guiding you on your spiritual journey!</p>

        <div class="footer">
          <p>Blessings & Light,<br>Mystical Tarot Reader</p>
          <p style="font-size: 12px; margin-top: 20px;">
            If you have any questions about your booking, please contact us.<br>
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email sending functions
export const sendBookingConfirmationEmail = async (data: BookingConfirmationData): Promise<void> => {
  try {
    const msg: EmailData = {
      to: data.customerEmail,
      subject: `Booking Confirmed - ${data.serviceName} - Mystical Tarot Reader`,
      html: getBookingConfirmationTemplate(data),
      from: process.env.EMAIL_FROM || 'abhisheksajwan458@gmail.com' // Your verified SendGrid sender
    };

    // For development, just log email
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Booking Confirmation Email (Development):', {
        to: msg.to,
        subject: msg.subject,
        customerName: data.customerName,
        bookingId: data.bookingId
      });
      return;
    }

    // For production, send actual email
    const mailer = await initializeSendGrid();
    if (mailer) {
      await mailer.send(msg);
      console.log('✅ Booking confirmation email sent to:', data.customerEmail);
    }
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error);
    throw error;
  }
};

export const sendPaymentConfirmationEmail = async (data: PaymentConfirmationData): Promise<void> => {
  try {
    const msg: EmailData = {
      to: data.customerEmail,
      subject: `Payment Confirmed - ${data.serviceName} - Mystical Tarot Reader`,
      html: getPaymentConfirmationTemplate(data),
      from: process.env.EMAIL_FROM || 'abhisheksajwan458@gmail.com' // Your verified SendGrid sender
    };

    // For development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('💰 Payment Confirmation Email (Development):', {
        to: msg.to,
        subject: msg.subject,
        customerName: data.customerName,
        bookingId: data.bookingId,
        paymentId: data.paymentId,
        amount: data.price
      });
      return;
    }

    // For production, send actual email
    const mailer = await initializeSendGrid();
    if (mailer) {
      await mailer.send(msg);
      console.log('✅ Payment confirmation email sent to:', data.customerEmail);
    }
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error);
    throw error;
  }
};
