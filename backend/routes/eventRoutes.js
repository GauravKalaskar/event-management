const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Admin routes
router.post('/', auth, roleCheck('admin'), createEvent);
router.put('/:id', auth, roleCheck('admin'), updateEvent);
router.delete('/:id', auth, roleCheck('admin'), deleteEvent);

module.exports = router;
