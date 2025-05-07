// ⏱️ In-memory storage for spam tracking
const messageTracker = new Map();

// 🦄 Unicorn MD Anti-Spam Middleware
export async function before(m, { conn }) {
  if (!m.isGroup || !m.sender) return;

  const now = Date.now();
  const sender = m.sender;
  const key = `${m.chat}:${sender}`;
  const timeWindow = 45 * 1000; // 45 seconds
  const maxMessages = 5;

  // Initialize if not present
  if (!messageTracker.has(key)) {
    messageTracker.set(key, []);
  }

  // Update timestamps
  let timestamps = messageTracker.get(key);
  timestamps.push(now);

  // Keep only recent timestamps within the time window
  timestamps = timestamps.filter(ts => now - ts <= timeWindow);
  messageTracker.set(key, timestamps);

  // If spam detected
  if (timestamps.length > maxMessages) {
    await conn.reply(
      m.chat,
      `⚠️ *Stop spamming!* You’ve sent more than ${maxMessages} messages in 45 seconds.\nPlease slow down, or the unicorn might cast a mute spell! 🦄`,
      m,
      { mentions: [sender] }
    );

    // Optionally: reset the user's message count
    messageTracker.set(key, []); // prevents repeated spam alerts
  }
}
