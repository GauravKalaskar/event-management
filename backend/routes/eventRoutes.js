const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', getEvents);
router.get('/:id', getEvent);

router.post('/', auth, roleCheck('admin'), createEvent);
router.put('/:id', auth, roleCheck('admin'), updateEvent);
router.delete('/:id', auth, roleCheck('admin'), deleteEvent);

module.exports = router;
