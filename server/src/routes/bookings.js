const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings - Accept booking details and store them in MongoDB
router.post('/', async (req, res) => {
  const { experienceId, date, time, fullName, email, promoCode, totalAmount } = req.body;
  
  // Validate required fields
  if (!experienceId || !date || !time || !fullName || !email) {
    return res.status(400).json({ message: 'Missing required booking information' });
  }
  
  try {
    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      experienceId,
      date,
      time
    });
    
    if (existingBooking) {
      return res.status(409).json({ message: 'This slot is already booked' });
    }
    
    // Create booking reference
    const bookingReference = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    // Create new booking in MongoDB
    const newBooking = new Booking({
      experienceId,
      date,
      time,
      fullName,
      email,
      promoCode,
      totalAmount,
      bookingReference,
      createdAt: new Date()
    });
    
    // Save booking to MongoDB
    await newBooking.save();
    
    res.status(201).json({
      message: 'Booking confirmed',
      bookingReference: bookingReference
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

module.exports = router;