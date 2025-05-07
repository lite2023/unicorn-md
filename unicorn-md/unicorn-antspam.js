// ☠️ DON'T COPY PASTE SILVA TECH INC CODE. OUR CODES ARE FOR TESTING 
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
      await conn.sendMessage(chatId, {
        text: `🚨 *Stop Spamming!*\n@${senderId.split('@')[0]}, you've sent more than ${maxMessages} messages in under 45 seconds.\nPlease slow down or face Unicorn consequences. 🦄`,
        contextInfo: {
          mentionedJid: [senderId],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363200367779016@newsletter',
            newsletterName: 'Unicorn MD • Spam Detector',
            serverMessageId: 143,
          },
        },
      }, { quoted: m });

    messageTracker[key] = []; // Optional: reset messages after warning
  }
}
