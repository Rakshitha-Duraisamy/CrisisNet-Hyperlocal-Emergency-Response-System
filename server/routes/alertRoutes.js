const express = require('express');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/auth');
const { calculatePriority } = require('../services/priorityService');
const { findNearbyHelpers } = require('../services/helperMatchService');
const { sendEmergencySMS } = require('../services/smsService');

const router = express.Router();

// POST /api/alerts  — Create a new emergency alert
router.post('/', protect, async (req, res) => {
  try {
    const { type, description, location, sendSMS } = req.body;

    // 1. AI Priority Ranking
    const { score, level } = calculatePriority({ type, description });

    // 2. Create alert in DB
    const alert = await Alert.create({
      sender: req.user._id,
      type,
      description,
      location,
      priorityScore: score,
      priorityLevel: level,
    });

    // 3. Find nearby helpers
    const helpers = location?.coordinates
      ? await findNearbyHelpers(location.coordinates, type)
      : [];

    // 4. Real-time broadcast via Socket.io
    req.io.emit('new_alert', {
      alert,
      nearbyHelpers: helpers.map((h) => h._id),
    });

    // Notify specific helpers in their own room
    helpers.forEach((h) => {
      req.io.to(`helper_${h._id}`).emit('alert_assigned', { alert });
    });

    // 5. SMS Fallback (optional)
    let smsResult = null;
    if (sendSMS && helpers.length > 0) {
      const phones = helpers.map((h) => h.phone);
      smsResult = await sendEmergencySMS(phones, alert);
      await Alert.findByIdAndUpdate(alert._id, { smsSent: true, smsRecipients: phones });
    }

    res.status(201).json({
      success: true,
      alert,
      helpersNotified: helpers.length,
      sms: smsResult,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/alerts  — List alerts (paginated)
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, limit = 20, page = 1 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const alerts = await Alert.find(query)
      .sort({ priorityScore: -1, createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .populate('sender', 'name phone')
      .populate('assignedHelpers', 'name phone');

    res.json({ success: true, count: alerts.length, alerts });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/alerts/:id  — Get single alert
router.get('/:id', protect, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('sender', 'name phone')
      .populate('assignedHelpers', 'name phone skills');

    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, alert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/alerts/:id/status  — Update alert status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };

    if (status === 'in_progress') update.respondedAt = new Date();
    if (status === 'resolved') update.resolvedAt = new Date();

    const alert = await Alert.findByIdAndUpdate(req.params.id, update, { new: true });

    // Broadcast status change
    req.io.emit('alert_updated', { alertId: alert._id, status });

    res.json({ success: true, alert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/alerts/:id/respond  — Helper responds to an alert
router.post('/:id/respond', protect, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { assignedHelpers: req.user._id },
        status: 'assigned',
      },
      { new: true }
    );

    // Mark helper as unavailable
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, { isAvailable: false });

    // Notify the alert sender
    req.io.to(`user_${alert.sender}`).emit('helper_responding', {
      helper: { id: req.user._id, name: req.user.name },
      alertId: alert._id,
    });

    res.json({ success: true, message: 'Response registered', alert });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
