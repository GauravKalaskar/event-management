const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
