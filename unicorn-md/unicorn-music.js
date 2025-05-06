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
      `https://aemt.me/download/ytmp3?url=${link}`, // ✅ active
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`, // fallback
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}` // fallback
    ]

    let songInfo = null
    let audioUrl = null

    for (const api of apiList) {
      try {
        const res = await axios.get(api)
        if (res.status === 410) {
          console.log(`⚠️ 410 Gone from: ${api}`)
          continue
        }

        const data = res.data
        if (data.status === 200 || data.success || data.result) {
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
        console.log(`❌ API failed (${api}): ${err.message}`)
        continue
      }
    }

    if (!audioUrl || !songInfo) {
      return m.reply("⚠️🌩️ All music portals are currently closed. Please try again shortly!")
    }

    const caption = `🦄🎵 *Unicorn Melody Found!*

🎧 *Title:* ${songInfo.title}
🎤 *Artist:* ${songInfo.artist}
📺 *YouTube:* ${songInfo.videoUrl}

✨ Use the magic buttons below to enjoy the tune.
— *Unicorn MD Music Realm*`

    await conn.sendMessage(m.chat, {
      image: { url: songInfo.thumbnail },
      caption,
      footer: "🎶 Tap a spell below:",
      buttons: [
        { buttonId: `.stream ${audioUrl}`, buttonText: { displayText: "▶️ Stream Now" }, type: 1 },
        { buttonId: `.download ${audioUrl}`, buttonText: { displayText: "⬇️ Audio File" }, type: 1 },
        { buttonId: `.doc ${audioUrl}|${songInfo.title}`, buttonText: { displayText: "📄 As Document" }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })

  } catch (error) {
    console.error("❌ Error in music handler:", error)
    return m.reply("❌ Something interrupted the melody:\n" + error.message)
  }
}

handler.help = ["music"]
handler.tags = ["downloader"]
handler.command = /^music$/i

export default handler
