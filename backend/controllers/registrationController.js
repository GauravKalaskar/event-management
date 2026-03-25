const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/registrations
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check capacity
    if (event.capacity > 0) {
      const currentCount = await Registration.countDocuments({ eventId });
      if (currentCount >= event.capacity) {
        return res.status(400).json({ message: 'Event is full. Registration closed.' });
      }
    }

    // Check for duplicate registration
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    const registration = await Registration.create({ userId, eventId });

    res.status(201).json({ message: 'Successfully registered for the event!', registration });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's registrations
// @route   GET /api/registrations/my
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id })
      .populate({
        path: 'eventId',
        populate: { path: 'createdBy', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get registrations for a specific event (Admin)
// @route   GET /api/registrations/event/:eventId
exports.getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    // Only the user who registered or admin can cancel
    if (registration.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this registration.' });
    }

    await registration.deleteOne();
    res.json({ message: 'Registration cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};
