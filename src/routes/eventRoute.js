const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent
} = require('../controllers/eventController');
const { protect } = require('../middlewares/validationToken');

// Public routes to get events
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Private route to create an event
router.post('/', protect, createEvent);

module.exports = router;