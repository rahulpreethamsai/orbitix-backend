const express = require('express');
const router = express.Router();
const {createAttraction, getAllAttractions, getAttractionById } = require('../controllers/eventController');
const { protect } = require('../middlewares/validationToken');

// Public routes to get events
router.get('/', getAllAttractions);
router.get('/:id', getAttractionById);

// Private route to create an event
router.post('/', protect, createAttraction);

module.exports = router;