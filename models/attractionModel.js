const mongoose = require('mongoose');

const attractionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the user who created the event
    },
    name: {
      type: String,
      required: [true, 'Please add an event name'],
    },
    category: {
    type: String,
    required: true,
    enum: ['All','Music', 'Sports', 'Cinema', 'Tech', 'Podcasts'], 
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
  },
  {
    timestamps: true,
  }
);

const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;