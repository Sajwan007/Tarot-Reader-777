const Booking = require('../models/Booking-supabase');
const Client = require('../models/Client-supabase');
const { sendEmail } = require('../utils/emailService');

exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const filters = {};

    if (status && status !== 'all') {
      filters.status = status;
    }

    if (date) {
      filters.date = date;
    }

    if (search) {
      filters.search = search;
    }

    const bookings = await Booking.findAll(filters);
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error in getBooking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // Update or create client
    const clientData = {
      name: req.body.clientName,
      email: req.body.email,
      phone: req.body.phone,
      total_bookings: 1,
      total_spent: req.body.price || 0,
      last_booking: req.body.date
    };

    await Client.upsert(clientData);

    // Send email notification
    try {
      await sendEmail({
        to: req.body.email,
        subject: 'Booking Confirmation - Tarot Reader 777',
        html: `
          <h2>Your booking has been received!</h2>
          <p>Hi ${req.body.clientName},</p>
          <p>Your ${req.body.service} is scheduled for:</p>
          <p><strong>Date:</strong> ${new Date(req.body.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${req.body.time}</p>
          <p><strong>Duration:</strong> ${req.body.duration} minutes</p>
          <p><strong>Price:</strong> $${req.body.price}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.update(req.params.id, req.body);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error in updateBooking:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.delete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Booking.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
