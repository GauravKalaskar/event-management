const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    capacity: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    image: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
// Add normal index for date sorting
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
