//THIS IS A PROPERTY OF SILVA TECH INC. DONT MAKE ME ENCRYPT THIS DATA. COPY WITH CREDIT. THIS IS AN OPEN SOURCE CODE

import axios from "axios"
import ytSearch from "yt-search"

let handler = async (m, { conn, text, botname }) => {
  if (!text) {
    return m.reply("🦄✨ What magical melody would you like to summon, adventurer?")
  }

  await m.reply("🔍✨ Searching the realms of YouTube for your enchanted request...")

  try {
    const search = await ytSearch(text)
    const video = search.videos[0]

    if (!video) {
      return m.reply("😔💨 No spell matched your tune. Try another incantation.")
    }

    const link = video.url
    const apiList = [
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`
    ]

    let songInfo = null
    let audioUrl = null

    for (const api of apiList) {
      try {
        const { data } = await axios.get(api)
        if (data.status === 200 || data.success) {
          audioUrl = data.result?.downloadUrl || data.url
          songInfo = {
            title: data.result?.title || video.title,
            artist: data.result?.author || video.author.name,
            thumbnail: data.result?.image || video.thumbnail,
            videoUrl: link
          }
          break
        }
      } catch (err) {
        console.log(`🌀 API failed (${api}): ${err.message}`)
        continue
      }
    }

    if (!audioUrl || !songInfo) {
      return m.reply("⚠️🌩️ All music portals are currently closed. Please try again shortly!")
    }

    const caption = `🦄🎵 *Enchanted Unicorn Melody Summoned!*

🎧 *Title:* ${songInfo.title}
🎤 *Artist:* ${songInfo.artist}
📺 *YouTube:* ${songInfo.videoUrl}

✨ Tap the magic buttons below to enjoy your melody.
— *Powered by Unicorn MD*`

    await conn.sendMessage(m.chat, {
      image: { url: songInfo.thumbnail },
      caption,
      footer: "🎶 Choose your path:",
      buttons: [
        { buttonId: `.stream ${audioUrl}`, buttonText: { displayText: "▶️ Stream Now" }, type: 1 },
        { buttonId: `.download ${audioUrl}`, buttonText: { displayText: "⬇️ Audio File" }, type: 1 },
        { buttonId: `.doc ${audioUrl}|${songInfo.title}`, buttonText: { displayText: "📄 As Document" }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })

  } catch (error) {
    console.error("❌ Magic disruption:", error.message)
    return m.reply("❌⚡ Something disturbed the musical ether:\n" + error.message)
  }
}

handler.help = ["music"]
handler.tags = ["downloader"]
handler.command = /^music$/i

export default handler
