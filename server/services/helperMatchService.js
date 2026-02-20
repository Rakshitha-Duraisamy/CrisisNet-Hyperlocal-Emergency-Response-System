const User = require('../models/User');

/**
 * Find available helpers near a given location
 * @param {number[]} coordinates - [longitude, latitude]
 * @param {string} alertType - emergency type to match skills
 * @param {number} radiusKm - search radius in km (default 10)
 * @returns {User[]} sorted list of matching helpers
 */
const findNearbyHelpers = async (coordinates, alertType, radiusKm = 10) => {
  const helpers = await User.find({
    role: 'helper',
    isAvailable: true,
    isActive: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: radiusKm * 1000, // meters
      },
    },
  }).limit(20);

  // Score helpers: skill match + rating
  const scored = helpers.map((h) => {
    let score = h.rating * 10; // base: 0-50
    if (h.skills?.includes(alertType)) score += 30; // skill match bonus
    if (h.totalResponses > 10) score += 10; // experience bonus
    return { helper: h, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.helper);
};

module.exports = { findNearbyHelpers };
