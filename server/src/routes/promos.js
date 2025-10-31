const express = require('express');
const router = express.Router();

// POST /api/promo/validate - Validate promo codes
router.post('/validate', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Promo code is required' });
  }
  
  const promoCode = global.promoCodes[code];
  
  if (!promoCode) {
    return res.status(404).json({ message: 'Invalid promo code' });
  }
  
  res.json({
    valid: true,
    code,
    discount: promoCode
  });
});

module.exports = router;