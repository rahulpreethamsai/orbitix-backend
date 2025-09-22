const asyncHandler = require('express-async-handler');
const Attraction = require('../models/attractionModel');

// @desc    Create one or multiple attractions
// @route   POST /api/events
// @access  Private
const createAttraction = asyncHandler(async (req, res) => {
  let data = req.body;

  // If a single object is sent, wrap it in an array
  if (!Array.isArray(data)) {
    data = [data];
  }

  // Validate all objects in the array
  for (let item of data) {
    if (
      !item.name ||
      !item.category ||
      !item.description ||
      !item.date ||
      !item.venue ||
      !item.imageUrl
    ) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // attach user id if needed
    item.user = req.user.id;
  }

  // Insert all documents at once
  const events = await Attraction.insertMany(data);

  res.status(201).json(events);
});

// @desc    Get all attractions
// @route   GET /api/events
// @access  Public
const getAllAttractions = asyncHandler(async (req, res) => {
  const events = await Attraction.find({}).sort({ date: 1 });
  res.status(200).json(events);
});

// @desc    Get a single attraction by ID
// @route   GET /api/events/:id
// @access  Public
const getAttractionById = asyncHandler(async (req, res) => {
  const event = await Attraction.findById(req.params.id);

  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

module.exports = {
  createAttraction,
  getAllAttractions,
  getAttractionById,
};
