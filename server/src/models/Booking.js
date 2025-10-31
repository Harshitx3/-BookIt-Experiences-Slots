const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  experienceId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  promoCode: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);