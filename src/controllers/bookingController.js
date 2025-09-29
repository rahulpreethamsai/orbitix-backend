const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookModel');
const Attraction = require('../models/attractionModel'); // You need to access the event/attraction model

// @desc    Create a new booking with seat validation
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seatNumbers } = req.body; // Expecting an array of seat numbers

  if (!eventId || !seatNumbers || seatNumbers.length === 0) {
    res.status(400);
    throw new Error('Event ID and at least one seat number are required.');
  }

  // Find the event in the database
  const event = await Attraction.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  let totalPrice = 0;
  const seatsToBook = [];
  let validationFailed = false;

  // Loop through the event's layout to find and validate the selected seats
  event.seatingChart.layout.forEach(row => {
    row.seats.forEach(seat => {
      if (seatNumbers.includes(seat.number)) {
        if (seat.status !== 'available') {
          validationFailed = true; // Mark validation as failed
        }
        seatsToBook.push(seat);
        // Safely get the price from the pricing map
        totalPrice += event.seatingChart.pricing.get(seat.priceTier) || 0;
      }
    });
  });

  // If any seat was not available, throw an error
  if (validationFailed) {
    res.status(409); // 409 Conflict is a good status code for this
    throw new Error('One or more selected seats are no longer available. Please refresh and try again.');
  }

  // --- At this point, you would typically integrate a payment gateway ---

  // Update the status of the seats to 'booked'
  seatsToBook.forEach(seat => {
    seat.status = 'booked';
  });

  // Save the updated event with the new seat statuses
  await event.save();

  // Create the booking record
  const booking = await Booking.create({
    user: req.user._id,
    eventId: event._id,
    eventName: event.name,
    eventDate: event.date,
    venue: event.venue,
    imageUrl: event.imageUrl,
    seats: seatNumbers, // Store the booked seat numbers
    totalPrice: totalPrice, // Store the final price
  });

  // TODO: Broadcast this update to all clients in the event room
  // io.to(eventId).emit('seatsBooked', seatNumbers);

  res.status(201).json(booking);
});

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id });
  res.json(bookings);
});

module.exports = { createBooking, getMyBookings };