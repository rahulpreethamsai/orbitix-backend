const mongoose = require('mongoose');

// Nested Schema for an individual seat
const seatSchema = new mongoose.Schema({
  number: { type: String, required: true }, // e.g., 'A1', 'B2'
  status: {
    type: String,
    enum: ['available', 'selected', 'booked'],
    default: 'available',
  },
  priceTier: { type: String, required: true }, // e.g., 'balcony', 'vip'
}, {_id: false}); // _id is not needed for sub-documents here

// Nested Schema for a row of seats
const rowSchema = new mongoose.Schema({
  row: { type: String, required: true }, // e.g., 'A', 'B'
  seats: [seatSchema],
}, {_id: false});

const attractionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add an event name'],
    },
    category: {
      type: String,
      required: true,
      enum: ['All', 'Music', 'Sports', 'Cinema', 'Tech', 'Podcasts'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    venue: {
      type: String,
      required: [true, 'Please add a venue'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    // --- NEWLY ADDED FIELD ---
    seatingChart: {
      layout: [rowSchema],
      pricing: {
        type: Map,
        of: Number, // Allows storing key-value pairs like { "balcony": 50, "vip": 5000 }
      }
    }
  },
  {
    timestamps: true,
  }
);

const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;