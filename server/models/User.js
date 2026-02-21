const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  // Role: 'victim' (sends alerts) or 'helper' (responds to alerts)
  role: { type: String, enum: ['victim', 'helper', 'admin'], default: 'victim' },

  // Helper-specific fields
  skills: [String], // e.g. ['medical', 'fire', 'rescue']
  isAvailable: { type: Boolean, default: true },
  location: {
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number]
  }
  },
  rating: { type: Number, default: 5.0 },
  totalResponses: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ location: '2dsphere' }, { sparse: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
