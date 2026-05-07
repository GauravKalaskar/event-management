const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, getEventRegistrations, cancelRegistration } = require('../controllers/registrationController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, registerForEvent);
router.get('/my', auth, getMyRegistrations);
router.delete('/:id', auth, cancelRegistration);
router.get('/event/:eventId', auth, roleCheck('admin'), getEventRegistrations);

module.exports = router;
