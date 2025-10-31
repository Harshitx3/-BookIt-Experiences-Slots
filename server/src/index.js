const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const experienceRoutes = require('./routes/experiences');
const bookingRoutes = require('./routes/bookings');
const promoRoutes = require('./routes/promos');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

// MongoDB connection (commented out for now as we'll use mock data)
/*
mongoose.connect('mongodb://localhost:27017/bookit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
*/

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For demo purposes, we'll use in-memory data
global.experiences = [
  {
    id: '1',
    title: 'Kayaking',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    price: 899,
    description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
    longDescription: 'Guided small-group experience. Certified guide. Safety first with gear included. Helmet and life jacket. All skill levels welcome in kayaking.'
  },
  {
    id: '2',
    title: 'Mountain Hiking',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    price: 799,
    description: 'Explore scenic mountain trails with experienced guides.',
    longDescription: 'Explore scenic mountain trails with experienced guides. Beautiful views and wildlife sightings. Suitable for moderate fitness levels.'
  },
  {
    id: '3',
    title: 'Scuba Diving',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    price: 1299,
    description: 'Discover underwater wonders with certified instructors.',
    longDescription: 'Discover underwater wonders with certified instructors. All equipment provided. Training session included for beginners.'
  }
];

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Store promo codes
global.promoCodes = {
  'SAVE10': { type: 'percentage', value: 10 },
  'FLAT100': { type: 'fixed', value: 100 }
};