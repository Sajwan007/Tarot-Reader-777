import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: any;
}

export async function sendEmail({ to, subject, template, data }: EmailData) {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: process.env.SENDGRID_FROM_NAME || 'Tarot Reader 777'
      },
      subject,
      html: generateEmailTemplate(template, data)
    };

    await sgMail.send(msg);
    
    // Log email sent
    console.log(`Email sent to ${to} with template: ${template}`);
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('SendGrid error:', error);
    throw new Error('Failed to send email');
  }
}

function generateEmailTemplate(template: string, data: any): string {
  switch (template) {
    case 'booking-confirmation':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - Tarot Reader 777</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .qr-section { text-align: center; margin: 30px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔮 Tarot Reader 777</h1>
              <h2>Booking Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear ${data.clientName},</p>
              <p>Thank you for booking a tarot reading session with us! Your booking has been confirmed and we're excited to guide you on your spiritual journey.</p>
              
              <div class="booking-details">
                <h3>📅 Booking Details</h3>
                <p><strong>Service:</strong> ${data.serviceName}</p>
                <p><strong>Date:</strong> ${data.bookingDate}</p>
                <p><strong>Time:</strong> ${data.bookingTime}</p>
                <p><strong>Duration:</strong> ${data.duration} minutes</p>
                <p><strong>Amount:</strong> ₹${data.amount}</p>
              </div>
              
              ${data.qrCode ? `
              <div class="qr-section">
                <h3>💳 Payment Information</h3>
                <p>Please complete your payment using the QR code below:</p>
                <img src="${data.qrCode}" alt="Payment QR Code" style="max-width: 200px; height: auto;">
                <p><strong>UPI ID:</strong> ${data.upiId}</p>
                <p><strong>Amount:</strong> ₹${data.amount}</p>
                <p><em>QR code expires in ${data.expiresIn} hours</em></p>
              </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${data.appUrl}/book" class="btn">View Booking Details</a>
              </div>
              
              <p><strong>Important Notes:</strong></p>
              <ul>
                <li>Please arrive 5 minutes before your scheduled time</li>
                <li>Have your questions ready for the reading</li>
                <li>Payment must be completed before the session</li>
                <li>You'll receive a reminder 2 hours before your session</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>🔮 Tarot Reader 777 - Guiding Your Spiritual Journey</p>
              <p>If you have any questions, please contact us at ${process.env.SENDGRID_FROM_EMAIL}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    case 'payment-confirmed':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmed - Tarot Reader 777</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Confirmed</h1>
              <h2>Tarot Reader 777</h2>
            </div>
            
            <div class="content">
              <div class="success-box">
                <h3>🎉 Your payment has been successfully verified!</h3>
                <p>Your booking is now confirmed and ready for your tarot reading session.</p>
              </div>
              
              <p>Dear ${data.clientName},</p>
              <p>We're pleased to inform you that your payment of ₹${data.amount} has been successfully processed.</p>
              
              <div class="booking-details">
                <h3>📅 Confirmed Booking Details</h3>
                <p><strong>Service:</strong> ${data.serviceName}</p>
                <p><strong>Date:</strong> ${data.bookingDate}</p>
                <p><strong>Time:</strong> ${data.bookingTime}</p>
                <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
                <p><strong>Payment Verified:</strong> ${data.verifiedAt}</p>
              </div>
              
              <h3>🔮 What's Next?</h3>
              <ul>
                <li>You'll receive a reminder 2 hours before your session</li>
                <li>Please ensure you're in a quiet space for the reading</li>
                <li>Have your specific questions ready</li>
                <li>The session will start exactly at the scheduled time</li>
              </ul>
              
              <p>We look forward to providing you with insightful guidance and clarity through your tarot reading session.</p>
            </div>
            
            <div class="footer">
              <p>🔮 Tarot Reader 777 - Guiding Your Spiritual Journey</p>
              <p>If you have any questions, please contact us at ${process.env.SENDGRID_FROM_EMAIL}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    case 'booking-reminder':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reminder - Tarot Reader 777</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-box { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Reminder</h1>
              <h2>Your Tarot Reading Session Starts Soon!</h2>
            </div>
            
            <div class="content">
              <div class="reminder-box">
                <h3>🔮 Your session starts in 2 hours!</h3>
                <p>Get ready for your spiritual journey with Tarot Reader 777</p>
              </div>
              
              <p>Dear ${data.clientName},</p>
              <p>This is a friendly reminder that your tarot reading session is scheduled to begin in 2 hours.</p>
              
              <div class="booking-details">
                <h3>📅 Session Details</h3>
                <p><strong>Service:</strong> ${data.serviceName}</p>
                <p><strong>Date:</strong> ${data.bookingDate}</p>
                <p><strong>Time:</strong> ${data.bookingTime}</p>
                <p><strong>Duration:</strong> ${data.duration} minutes</p>
              </div>
              
              <h3>📝 Preparation Tips</h3>
              <ul>
                <li>Find a quiet, comfortable space for your reading</li>
                <li>Have your questions written down</li>
                <li>Ensure stable internet connection if it's an online session</li>
                <li>Keep a notebook handy to record insights</li>
                <li>Arrive 5 minutes early to settle in</li>
              </ul>
              
              <p>We're excited to connect with you and provide the guidance you seek through the tarot cards.</p>
            </div>
            
            <div class="footer">
              <p>🔮 Tarot Reader 777 - Guiding Your Spiritual Journey</p>
              <p>If you need to reschedule, please contact us at ${process.env.SENDGRID_FROM_EMAIL}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
    default:
      return `
        <html>
        <body>
          <h1>Tarot Reader 777</h1>
          <p>${JSON.stringify(data)}</p>
        </body>
        </html>
      `;
  }
}
