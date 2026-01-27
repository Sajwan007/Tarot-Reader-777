const Booking = require('../models/Booking');
const Client = require('../models/Client');
const { validateBooking } = require('../utils/validators');

const getAllBookings = async (req, res, next) => {
  try {
    const { status, date_from, date_to } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;

    const bookings = await Booking.findAll(filters);
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user has permission to view this booking
    if (req.user.type === 'client' && booking.client_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { error } = validateBooking(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Create or find client
    let client;
    if (req.body.client_email) {
      client = await Client.findByEmail(req.body.client_email);
      if (!client) {
        client = await Client.create({
          name: req.body.client_name,
          email: req.body.client_email,
          phone: req.body.client_phone
        });
      }
    }

    const bookingData = {
      client_id: client ? client.id : null,
      service_type: req.body.service_type,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || 'pending',
      notes: req.body.notes
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.update(req.params.id, req.body);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.delete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const getClientBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findByClientId(req.params.clientId);
    
    // Check if user has permission to view these bookings
    if (req.user.type === 'client' && req.params.clientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getClientBookings
};
