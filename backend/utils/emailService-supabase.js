const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM || 'noreply@tarot777.com',
      subject,
      html,
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);
    return response;
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    throw error;
  }
};

// Specific email templates
exports.sendBookingConfirmation = async (booking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">✨ Tarot Reader 777</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Booking Confirmation</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${booking.clientName},</h2>
        <p style="color: #666; line-height: 1.6;">Thank you for booking with Tarot Reader 777! Your ${booking.service} has been confirmed.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
          <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p style="margin: 10px 0;"><strong>Time:</strong> ${booking.time}</p>
          <p style="margin: 10px 0;"><strong>Service:</strong> ${booking.service}</p>
          <p style="margin: 10px 0;"><strong>Duration:</strong> ${booking.duration} minutes</p>
          <p style="margin: 10px 0;"><strong>Price:</strong> $${booking.price}</p>
        </div>
        
        ${booking.notes ? `
        <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #555;"><strong>Notes:</strong> ${booking.notes}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; margin-bottom: 20px;">We look forward to seeing you!</p>
          <a href="https://your-frontend-domain.vercel.app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            View Your Booking
          </a>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">© 2024 Tarot Reader 777. All rights reserved.</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: booking.email,
    subject: `Booking Confirmation - ${booking.service} - Tarot Reader 777`,
    html
  });
};

exports.sendBookingReminder = async (booking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🔔 Reminder</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your appointment is coming up!</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Hi ${booking.clientName},</h2>
        <p style="color: #666; line-height: 1.6;">This is a friendly reminder about your upcoming ${booking.service} appointment.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
          <p style="margin: 10px 0;"><strong>Tomorrow:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p style="margin: 10px 0;"><strong>Time:</strong> ${booking.time}</p>
          <p style="margin: 10px 0;"><strong>Service:</strong> ${booking.service}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;"><strong>Please note:</strong> If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://your-frontend-domain.vercel.app" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            Manage Booking
          </a>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">© 2024 Tarot Reader 777. All rights reserved.</p>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: booking.email,
    subject: `Reminder: Your ${booking.service} Tomorrow - Tarot Reader 777`,
    html
  });
};

exports.sendStatusUpdate = async (booking, oldStatus, newStatus) => {
  const statusColors = {
    confirmed: '#28a745',
    completed: '#007bff',
    cancelled: '#dc3545'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">📅 Status Update</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your booking status has changed</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${booking.clientName},</h2>
        <p style="color: #666; line-height: 1.6;">Your booking status has been updated from <strong>${oldStatus}</strong> to <strong style="color: ${statusColors[newStatus] || '#333'}">${newStatus}</strong>.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin-top: 0;">Booking Details:</h3>
          <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p style="margin: 10px 0;"><strong>Time:</strong> ${booking.time}</p>
          <p style="margin: 10px 0;"><strong>Service:</strong> ${booking.service}</p>
          <p style="margin: 10px 0;"><strong>Status:</strong> <span style="color: ${statusColors[newStatus] || '#333'}; font-weight: bold;">${newStatus}</span></p>
        </div>
        
        ${newStatus === 'confirmed' ? `
        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724;"><strong>Great news!</strong> Your booking has been confirmed. We look forward to seeing you!</p>
        </div>
        ` : ''}
        
        ${newStatus === 'cancelled' ? `
        <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p style="margin: 0; color: #721c24;"><strong>Booking Cancelled:</strong> If you didn't request this cancellation, please contact us immediately.</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://your-frontend-domain.vercel.app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            View Booking
          </a>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">© 2024 Tarot Reader 777. All rights reserved.</p>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: booking.email,
    subject: `Booking Status Update: ${newStatus} - Tarot Reader 777`,
    html
  });
};
