// 🌟 Unicorn MD Anti-Spam Plugin
const messageTracker = {}; // In-memory spam record

export async function before(m, { conn }) {
  if (!m.isGroup || !m.sender) return;

  const chatId = m.chat;
  const senderId = m.sender;
  const key = `${chatId}-${senderId}`;
  const now  Date.now();
  const timeLimit = 45 * 1000; // 45 seconds
  const maxMessages = 5;

  // Initialize if needed
  if (!messageTracker[key]) {
    messageTracker[key] = [];
  }

  // Push current message timestamp
  messageTracker[key].push(now);

  // Keep only recent timestamps
  messageTracker[key] = messageTracker[key].filter(ts => now - ts <= timeLimit);

  // If message count exceeds threshold
  if (messageTracker[key].length > maxMessages) {
    await conn.reply(chatId, `🚨 *Stop Spamming!*\nYou've sent more than ${maxMessages} messages in under 45 seconds.\nPlease slow down or face the wrath of the unicorn. 🦄`, m);

    messageTracker[key] = []; // reset to avoid repeat warnings
  }
}
