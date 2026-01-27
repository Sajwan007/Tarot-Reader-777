const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getStats
} = require('../controllers/bookingController-supabase');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllBookings).post(createBooking);
router.get('/stats', protect, getStats);
router.route('/:id').get(protect, getBooking).put(protect, updateBooking).delete(protect, deleteBooking);

module.exports = router;
