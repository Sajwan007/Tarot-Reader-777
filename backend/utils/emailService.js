const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendBookingConfirmation(bookingData) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: bookingData.client_email,
      subject: 'Booking Confirmation - Tarot Reading',
      html: this.getBookingConfirmationTemplate(bookingData)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent');
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw error;
    }
  }

  async sendBookingReminder(bookingData) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: bookingData.client_email,
      subject: 'Reminder: Your Tarot Reading Appointment',
      html: this.getReminderTemplate(bookingData)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Reminder email sent');
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  }

  getBookingConfirmationTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Booking Confirmation</h2>
        <p>Dear ${data.client_name},</p>
        <p>Your tarot reading has been successfully booked!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Service:</strong> ${data.service_type}</p>
          <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Status:</strong> ${data.status}</p>
        </div>
        
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
        
        <p>Best regards,<br>Tarot Reader Team</p>
      </div>
    `;
  }

  getReminderTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Appointment Reminder</h2>
        <p>Dear ${data.client_name},</p>
        <p>This is a friendly reminder about your upcoming tarot reading appointment.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
          <h3>Appointment Details:</h3>
          <p><strong>Service:</strong> ${data.service_type}</p>
          <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${data.time}</p>
        </div>
        
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>Tarot Reader Team</p>
      </div>
    `;
  }
}

module.exports = new EmailService();
