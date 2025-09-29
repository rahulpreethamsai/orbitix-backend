const mongoose = require('mongoose');

// Define the schema for the Booking model
const bookingSchema = mongoose.Schema(
  {
    // Link to the User model to know who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the 'User' collection
    },
    eventId: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
