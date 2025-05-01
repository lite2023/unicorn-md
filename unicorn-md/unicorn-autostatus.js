export async function before(m, { isAdmin, isBotAdmin }) {
  try {
    const autoLikeEnabled = process.env.AUTO_STATUS_LIKE === "true";
    if (!autoLikeEnabled) return false;

    const likeEmoji = process.env.AUTO_STATUS_LIKE_EMOJI || "🦄";

    // Auto-react to status
    if (m?.key?.remoteJid === "status@broadcast") {
      const botJid = await conn.decodeJid(conn.user.id);

      await conn.sendMessage("status@broadcast", {
        react: {
          text: likeEmoji,
          key: m.key,
        }
      }, {
        statusJidList: [m.key.participant, botJid],
      });
    } else return false;

    // Check if Status Saver is enabled
    const saveEnabled = process.env.Status_Saver === "true";
    if (!saveEnabled) return false;

    this.story = this.story || [];
    const { mtype, sender } = m;
    if (!sender) return false;

    const senderName = await conn.getName(sender) || "Unknown";

    const baseMsg = Buffer.from("QVVUTyBTVEFUVVMgU0FWRVI=", "base64").toString("utf-8");
    let formattedText = '';

    if (["imageMessage", "videoMessage"].includes(mtype)) {
      formattedText = `🦄 *${baseMsg}*\n\n🩵 *Status by:* ${senderName}\n📝 *Caption:* ${m.caption || 'No caption'}`;
      await conn.copyNForward(conn.user.id, m, true);
      await this.reply(conn.user.id, formattedText, m, { mentions: [sender] });

      this.story.push({ type: mtype, quoted: m, sender, caption: formattedText, buffer: m });

    } else if (mtype === "audioMessage") {
      formattedText = `🦄 *${baseMsg}*\n\n🩵 *Status by:* ${senderName}`;
      await conn.copyNForward(conn.user.id, m, true);
      await this.reply(conn.user.id, formattedText, m);

      this.story.push({ type: mtype, quoted: m, sender, buffer: m });

    } else if (mtype === "extendedTextMessage") {
      formattedText = `🦄 *${baseMsg}*\n\n💬 ${m.text || 'No text'}`;
      await this.reply(conn.user.id, formattedText, m, { mentions: [sender] });

      this.story.push({ type: mtype, quoted: m, sender, message: formattedText });

    } else if (m.quoted) {
      await conn.copyNForward(conn.user.id, m.quoted, true);
      await conn.sendMessage(m.chat, { text: formattedText }, { quoted: m });

    } else {
      console.log("Unsupported or empty message type.");
      return false;
    }

    // Optional reply to status poster
    if (process.env.STATUS_REPLY?.toLowerCase() === "true") {
      const replyText = process.env.STATUS_MSG || "🦄 Unicorn MD saw your status! 🌈";
      const fakeStatus = {
        key: {
          remoteJid: 'status@broadcast',
          id: m.key.id,
          participant: sender,
        },
        message: m.message,
      };

      await conn.sendMessage(sender, { text: replyText }, { quoted: fakeStatus });
    }

  } catch (err) {
    console.error("Error processing status:", err.message || err);
    await this.reply(conn.user.id, `❌ Error handling status: ${err.message || 'Unknown error'}`, m);
  }

  return true;
}
