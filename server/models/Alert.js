const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['medical', 'fire', 'accident', 'crime', 'flood', 'other'],
    required: true
  },
  description: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    address: String,
  },

  // AI Priority Score (0-100, higher = more urgent)
  priorityScore: { type: Number, default: 50 },
  priorityLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'resolved', 'cancelled'],
    default: 'pending'
  },

  assignedHelpers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  respondedAt: Date,
  resolvedAt: Date,

  // Offline SMS fallback
  smsSent: { type: Boolean, default: false },
  smsRecipients: [String], // phone numbers

}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });
alertSchema.index({ status: 1, priorityScore: -1 });

module.exports = mongoose.model('Alert', alertSchema);
