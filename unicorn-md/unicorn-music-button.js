// THIS IS A SILVA TECH INC PROPERTY COPY WITH CAUTION ALWAYS OFFER CREDIT TO SILVA TECH INC DONT BE A FAKE DEVELOPER ASK BEFORE USING

let handler = async (m, { conn, args, command }) => {
  let input = args.join(" ").split("|")
  let url = input[0]?.trim()
  let title = input[1]?.trim() || "Unicorn_Melody"

  if (!url) return m.reply("⚠️ Missing audio URL or invalid input.")

  switch (command) {
    case "stream":
      await m.reply("🎧 Streaming the enchanted melody...")
      await conn.sendMessage(m.chat, {
        audio: { url },
        mimetype: "audio/mp4"
      }, { quoted: m })
      break

    case "download":
      await m.reply("⬇️ Downloading the mystical track...")
      await conn.sendMessage(m.chat, {
        audio: { url },
        mimetype: "audio/mp4"
      }, { quoted: m })
      break

    case "doc":
      await m.reply("📄 Sending as enchanted document...")
      await conn.sendMessage(m.chat, {
        document: { url },
        mimetype: "audio/mp3",
        fileName: `${title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`
      }, { quoted: m })
      break

    default:
      return m.reply("❌ Unknown magical command.")
  }
}

handler.command = /^(stream|download|doc)$/i
handler.help = ["stream", "download", "doc"]
handler.tags = ["downloader"]

export default handler
