const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');

const createEvent = asyncHandler(async (req, res) => {
  const { name, description, date, venue, imageUrl } = req.body;

  if (!name || !description || !date || !venue || !imageUrl) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const event = await Event.create({
    name,
    description,
    date,
    venue,
    imageUrl,
    user: req.user.id,
  });

  res.status(201).json(event);
});


const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ date: 1 });
  res.status(200).json(events);
});


const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
};