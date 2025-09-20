const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookModel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (requires authentication)
const createBooking = asyncHandler(async (req, res) => {
  const { eventId, eventName, eventDate, venue, imageUrl } = req.body;

  // Check if all required data is provided
  if (!eventId || !eventName || !eventDate || !venue || !imageUrl) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  // Create a new booking instance
  const booking = new Booking({
    user: req.user._id, // The user's ID is attached to the request by the 'protect' middleware
    eventId,
    eventName,
    eventDate,
    venue,
    imageUrl,
  });

  // Save the booking to the database
  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  // Find all bookings where the 'user' field matches the logged-in user's ID
  const bookings = await Booking.find({ user: req.user._id });
  res.json(bookings);
});

module.exports = { createBooking, getMyBookings };
