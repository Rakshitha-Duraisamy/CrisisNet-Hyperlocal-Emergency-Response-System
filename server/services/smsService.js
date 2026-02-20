/**
 * SMS Fallback Service (Twilio)
 * Used when users are offline or internet is unavailable.
 */

let twilioClient = null;

// Lazy-init Twilio (won't crash if keys aren't set)
const getClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

/**
 * Send SMS alert to a list of phone numbers
 * @param {string[]} phoneNumbers - recipients
 * @param {Object} alert - alert data
 */
const sendEmergencySMS = async (phoneNumbers, alert) => {
  const client = getClient();

  if (!client) {
    console.warn('⚠️  Twilio not configured. SMS not sent.');
    return { sent: false, reason: 'Twilio not configured' };
  }

  const message = `🚨 EMERGENCY ALERT
Type: ${alert.type.toUpperCase()}
Priority: ${alert.priorityLevel.toUpperCase()}
Location: ${alert.location?.address || 'Unknown'}
Details: ${alert.description || 'No details'}
Alert ID: ${alert._id}
Reply HELP to respond.`;

  const results = await Promise.allSettled(
    phoneNumbers.map((to) =>
      client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      })
    )
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  console.log(`📱 SMS sent to ${sent}/${phoneNumbers.length} recipients`);
  return { sent: true, delivered: sent, total: phoneNumbers.length };
};

module.exports = { sendEmergencySMS };
