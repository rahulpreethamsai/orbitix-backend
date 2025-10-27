const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookModel');
const Attraction = require('../models/attractionModel');


const createBooking = asyncHandler(async (req, res) => {

  const { eventId, eventName, eventDate, venue, imageUrl } = req.body;

  if (!eventId || !eventName || !eventDate || !venue || !imageUrl) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  const booking = await Booking.create({
    user: req.user._id, 
    eventId,
    eventName,
    eventDate,
    venue,
    imageUrl,
  });

  res.status(201).json(booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('attraction');
  res.json(bookings);
});

module.exports = { createBooking, getMyBookings };