const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookModel');
const Attraction = require('../models/attractionModel'); // for future use

// Create a booking
const createBooking = asyncHandler(async (req, res) => {
  const { attractionId, date } = req.body;

  // Optional: check if attraction exists
  const attraction = await Attraction.findById(attractionId);
  if (!attraction) {
    return res.status(404).json({ message: 'Attraction not found' });
  }

  const booking = await Booking.create({
    user: req.user._id,
    attraction: attractionId,
    date,
  });

  res.status(201).json(booking);
});

// Get all bookings of the logged-in user
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('attraction'); // populate if you want attraction details
  res.json(bookings);
});

module.exports = { createBooking, getMyBookings };
