const asyncHandler = require('express-async-handler');
const Attraction = require('../models/attractionModel');

const createAttraction = asyncHandler(async (req, res) => {
  let data = req.body;

  if (!Array.isArray(data)) {
    data = [data];
  }

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

    item.user = req.user.id;
  }

  const events = await Attraction.insertMany(data);

  res.status(201).json(events);
});

const getAllAttractions = asyncHandler(async (req, res) => {
  const events = await Attraction.find({}).sort({ date: 1 });
  res.status(200).json(events);
});

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
