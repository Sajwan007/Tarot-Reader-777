const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all bookings (admin only)
router.get('/', authMiddleware.authenticate, authMiddleware.requireAdmin, bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', authMiddleware.authenticate, bookingController.getBookingById);

// Create new booking
router.post('/', bookingController.createBooking);

// Update booking
router.put('/:id', authMiddleware.authenticate, authMiddleware.requireAdmin, bookingController.updateBooking);

// Delete booking
router.delete('/:id', authMiddleware.authenticate, authMiddleware.requireAdmin, bookingController.deleteBooking);

// Get client's bookings
router.get('/client/:clientId', authMiddleware.authenticate, bookingController.getClientBookings);

module.exports = router;
