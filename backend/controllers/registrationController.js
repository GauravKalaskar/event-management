const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) return res.status(400).json({ message: 'Event ID required' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.capacity > 0) {
      const currentCount = await Registration.countDocuments({ eventId });
      if (currentCount >= event.capacity) return res.status(400).json({ message: 'Event is full' });
    }

    const existing = await Registration.findOne({ userId, eventId });
    if (existing) return res.status(400).json({ message: 'Already registered' });

    const registration = await Registration.create({ userId, eventId });
    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    next(error);
  }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id })
      .populate({ path: 'eventId', populate: { path: 'createdBy', select: 'name email' } })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId }).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    if (registration.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await registration.deleteOne();
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    next(error);
  }
};
