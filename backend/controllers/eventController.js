const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getEvents = async (req, res, next) => {
  try {
    const { search, location, startDate, endDate, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (location) query.location = { $regex: location, $options: 'i' };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [events, total] = await Promise.all([
      Event.find(query).populate('createdBy', 'name email').sort({ date: 1 }).skip(skip).limit(parseInt(limit)),
      Event.countDocuments(query)
    ]);

    res.json({ events, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registrationCount = await Registration.countDocuments({ eventId: event._id });
    res.json({ ...event.toObject(), registrationCount });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, image, capacity } = req.body;
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: 'Title, description, date, and location required' });
    }

    const event = await Event.create({ title, description, date, location, image: image || '', capacity: capacity || 0, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date, location, image, capacity } = req.body;
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.image = image !== undefined ? image : event.image;
    event.capacity = capacity !== undefined ? capacity : event.capacity;

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await Registration.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};
