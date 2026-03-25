const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Event = require('../models/Event');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
    });

    // Create student user
    await User.create({
      name: 'John Student',
      email: 'john@college.edu',
      password: 'student123',
      role: 'student',
    });

    // Create sample events
    const events = [
      {
        title: 'Annual Tech Fest 2026',
        description: 'Join us for the biggest tech festival of the year! Featuring hackathons, workshops, keynote speakers from top tech companies, and exciting prizes. Open to all students and faculty.',
        date: new Date('2026-04-15T09:00:00'),
        location: 'Main Auditorium, Block A',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        capacity: 500,
        createdBy: admin._id,
      },
      {
        title: 'AI & Machine Learning Workshop',
        description: 'A hands-on workshop covering the fundamentals of AI and Machine Learning. Learn about neural networks, deep learning, and how to build your first ML model using Python and TensorFlow.',
        date: new Date('2026-04-20T10:00:00'),
        location: 'Computer Lab 3, Block B',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        capacity: 60,
        createdBy: admin._id,
      },
      {
        title: 'Cultural Night 2026',
        description: 'An evening of music, dance, and drama performances by talented students. Enjoy traditional and contemporary performances, followed by a DJ night and dinner.',
        date: new Date('2026-05-01T17:00:00'),
        location: 'Open Air Theatre',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        capacity: 1000,
        createdBy: admin._id,
      },
      {
        title: 'Web Development Bootcamp',
        description: 'An intensive 2-day bootcamp on modern web development. Covering React, Node.js, MongoDB, and deployment strategies. Perfect for beginners and intermediate developers.',
        date: new Date('2026-05-10T09:00:00'),
        location: 'Seminar Hall 1, Block C',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        capacity: 40,
        createdBy: admin._id,
      },
      {
        title: 'Sports Tournament - Cricket',
        description: 'Inter-department cricket tournament. Form your team of 11 and compete for the champions trophy! Matches will be played in T20 format.',
        date: new Date('2026-05-15T07:00:00'),
        location: 'College Cricket Ground',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
        capacity: 200,
        createdBy: admin._id,
      },
      {
        title: 'Entrepreneurship Summit',
        description: 'Meet successful entrepreneurs, learn about startup culture, and pitch your ideas to a panel of investors. Networking opportunities and mentorship sessions included.',
        date: new Date('2026-06-01T10:00:00'),
        location: 'Conference Hall, Admin Block',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        capacity: 150,
        createdBy: admin._id,
      },
    ];

    await Event.insertMany(events);

    console.log('Seed data created successfully!');
    console.log('---');
    console.log('Admin login: admin@college.edu / admin123');
    console.log('Student login: john@college.edu / student123');
    console.log('---');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
