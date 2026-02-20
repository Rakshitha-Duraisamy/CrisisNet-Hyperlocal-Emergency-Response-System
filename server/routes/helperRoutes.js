const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/helpers  — List all available helpers
router.get('/', protect, async (req, res) => {
  try {
    const { skill, available } = req.query;
    const query = { role: 'helper' };
    if (skill) query.skills = skill;
    if (available !== undefined) query.isAvailable = available === 'true';

    const helpers = await User.find(query).select('-password');
    res.json({ success: true, count: helpers.length, helpers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/helpers/availability  — Toggle helper availability
router.patch('/availability', protect, authorize('helper'), async (req, res) => {
  try {
    const { isAvailable } = req.body;
    await User.findByIdAndUpdate(req.user._id, { isAvailable });

    // Broadcast availability change
    req.io.emit('helper_availability', {
      helperId: req.user._id,
      isAvailable,
    });

    res.json({ success: true, isAvailable });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/helpers/nearby  — Find helpers near coordinates
router.get('/nearby', protect, async (req, res) => {
  try {
    const { lng, lat, radius = 10 } = req.query;

    const helpers = await User.find({
      role: 'helper',
      isAvailable: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000,
        },
      },
    }).select('-password').limit(10);

    res.json({ success: true, count: helpers.length, helpers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
