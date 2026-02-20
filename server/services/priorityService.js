/**
 * AI-Based Priority Ranking Service
 * Scores emergency alerts from 0–100 based on type, keywords, and time.
 */

// Base scores per emergency type
const TYPE_SCORES = {
  medical: 85,
  fire: 80,
  accident: 70,
  crime: 65,
  flood: 60,
  other: 40,
};

// Keyword boosters (+points if found in description)
const KEYWORD_BOOSTERS = [
  { words: ['unconscious', 'not breathing', 'cardiac', 'heart attack'], boost: 15 },
  { words: ['fire spreading', 'trapped', 'building collapse'], boost: 12 },
  { words: ['bleeding heavily', 'severe', 'critical', 'dying'], boost: 10 },
  { words: ['children', 'child', 'baby', 'infant'], boost: 8 },
  { words: ['multiple', 'many people', 'crowd'], boost: 6 },
];

/**
 * Calculate priority score for an alert
 * @param {Object} alertData - { type, description }
 * @returns {{ score: number, level: string }}
 */
const calculatePriority = (alertData) => {
  const { type, description = '' } = alertData;
  const descLower = description.toLowerCase();

  let score = TYPE_SCORES[type] || 40;

  // Apply keyword boosters
  for (const { words, boost } of KEYWORD_BOOSTERS) {
    if (words.some((w) => descLower.includes(w))) {
      score += boost;
    }
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Map score to level
  let level;
  if (score >= 85) level = 'critical';
  else if (score >= 65) level = 'high';
  else if (score >= 45) level = 'medium';
  else level = 'low';

  return { score, level };
};

module.exports = { calculatePriority };
