const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/validationToken');

// Route to get the current user's bookings.
// The 'protect' middleware will run first to ensure the user is authenticated.
router.get('/mybookings', protect, getMyBookings);

// Route to create a new booking.
// This is also a protected route.
router.post('/', protect, createBooking);

module.exports = router;
