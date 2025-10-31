const express = require('express');
const router = express.Router();

// GET /api/experiences - Return list of experiences
router.get('/', (req, res) => {
  res.json(global.experiences);
});

// GET /api/experiences/:id - Return details and slot availability
router.get('/:id', (req, res) => {
  const experience = global.experiences.find(exp => exp.id === req.params.id);
  
  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  
  // Mock available slots
  const availableSlots = {
    dates: ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'],
    times: ['09:00 am', '11:00 am', '01:00 pm']
  };
  
  res.json({
    ...experience,
    availability: availableSlots
  });
});

module.exports = router;