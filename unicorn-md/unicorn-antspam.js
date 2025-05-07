// 🌟 Unicorn MD Anti-Spam Plugin (Clean + Fixed)
const messageTracker = {};
const warnedUsers = {}; // Track users who were already warned

export async function before(m, { conn }) {
  if (!m.isGroup || !m.sender || m.fromMe) return;

  const chatId = m.chat;
  const senderId = m.sender;
  const key = `${chatId}-${senderId}`;
  const now = Date.now();
  const timeLimit = 45 * 1000; // 45 seconds
  const maxMessages = 5;
  const cooldown = 5 * 60 * 1000; // 2 minutes cooldown per user

  // Initialize message tracker
  if (!messageTracker[key]) messageTracker[key] = [];

  // Record timestamp
  messageTracker[key].push(now);

  // Keep only timestamps within the time limit
  messageTracker[key] = messageTracker[key].filter(ts => now - ts <= timeLimit);

  // Check if user exceeded spam limit
  if (messageTracker[key].length > maxMessages) {
    const lastWarned = warnedUsers[key] || 0;

    if (now - lastWarned > cooldown) {
      await conn.reply(chatId, `🚨 *Stop Spamming!*\nYou've sent more than ${maxMessages} messages in 45 seconds.\nPlease slow down, or the unicorn might mute you. 🦄`, m);
      warnedUsers[key] = now;
    }

    messageTracker[key] = []; // Optional: reset messages after warning
  }
}
