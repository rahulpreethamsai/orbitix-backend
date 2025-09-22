const asyncHandler = require('express-async-handler');
const Attraction = require('../models/attractionModel');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createAttraction = asyncHandler(async (req, res) => {
  const { name, category, description, date, venue, imageUrl } = req.body;

  if (!name || !category || !description || !date || !venue || !imageUrl) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const event = await Attraction.create({
    name,
    description,
    category,
    date,
    venue,
    imageUrl,
    user: req.user.id,
  });

  res.status(201).json(event);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllAttractions = asyncHandler(async (req, res) => {
  const events = await Attraction.find({}).sort({ date: 1 }); // Sort by date
  res.status(200).json(events);
});

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
const getAttractionById = asyncHandler(async (req, res) => {
  const event = await Attraction.findById(req.params.id);

  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

module.exports = {
  createAttraction,
  getAllAttractions,
  getAttractionById,
};