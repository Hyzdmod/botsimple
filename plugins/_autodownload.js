const { igdl, tiktok, twitter, pin } = require('../lib/scrape')
const { facebook } = require('../lib/facebook')
const { servers, yta, ytv } = require('../lib/y2mate')
const fetch = require('node-fetch')
let yts = require('yt-search')
let util = require('util')
let handler = m => m

handler.all = async function (m, { isPrems }) {

    if (m.chat.endsWith('broadcast')) return
    if (db.data.users[m.sender].banned) return
    if (db.data.chats[m.chat].isBanned) return

    let url = m.text.split(/\n| /i)[0]

    if (/^.*tiktok/i.test(m.text)) {
        let res = await fetch(API('hardianto', '/api/download/tiktok', { url }, 'apikey'))
        if (!res.ok) return 
        let json = await res.json()
        //await m.reply(wait)
        // m.reply(util.format(json))
        await this.sendFile(m.chat, json.nowm, '', 'Unravel-MD', m)
    }

    if (/^.*cocofun/i.test(m.text)) {
        let res = await fetch(API('jojo', '/api/cocofun-no-wm', { url }))
        if (!res.ok) return 
        let json = await res.json()
        await m.reply(wait)
        // m.reply(util.format(json))
        await this.sendFile(m.chat, json.download, '', 'Aqui tienes tu video', m)
    }

    if (/^.*(fb.watch|facebook.com)/i.test(m.text)) {
        let res = await fetch(API('neoxr', '/api/download/fb', { url }, 'apikey'))
        if (!res.ok) return 
        let json = await res.json()
        if (!json.status) return m.reply(util.format(json))
        await m.reply(wait)
        await conn.sendFile(m.chat, json.data.sd.url, '', `HD: ${json.data.hd.url}\nTamaño: ${json.data.hd.size}\n`, m)
    }

    if (/^.*instagram.com\/(p|reel|tv)/i.test(m.text)) {
        igdl(url).then(async res => {
            let igdl = JSON.stringify(res)
            let json = JSON.parse(igdl)
            await m.reply(wait)
            for (let { downloadUrl, type } of json) {
                this.sendFile(m.chat, downloadUrl, 'ig' + (type == 'image' ? '.jpg' : '.mp4'), 'Desde Instagram hasta WhatsApp', m, 0, { thumbnail: await (await fetch(downloadUrl)).buffer() })
            }
        }).catch(_ => _)
    }

    if (/^.*(pinterest.com\/pin|pin.it)/i.test(m.text)) {
        pin(url).then(async res => {
            let pin = JSON.stringify(res)
            let json = JSON.parse(pin)
            if (!json.status) return 
            await m.reply(wait)
            m.reply(util.format(json))
            await this.sendFile(m.chat, json.data.url, '', 'Aqui tiene su pedido', m)
        }).catch(_ => _)
    }

    if (/^.*twitter.com\//i.test(m.text)) {
        twitter(url).then(async res => {
            let twit = JSON.stringify(res)
            let json = JSON.parse(twit)
            let pesan = json.data.map((v) => `Link: ${v.url}`).join('\n------------\n')
            await m.reply(wait)
            for (let { url } of json.data) {
                this.sendFile(m.chat, url, 'ig' + (/mp4/i.test(url) ? '.mp4' : '.jpg'), 'Estas al día en Twitter ✓', m)
            }
        }).catch(_ => _)
    }

    if (/^https?:\/\/.*youtu/i.test(m.text)) {
        let results = await yts(url)
        let vid = results.all.find(video => video.seconds < 3600)
        if (!vid) return m.reply('Vídeo/Audio no encontrado')
        let yt = false
        let usedServer = servers[0]
        for (let i in servers) {
            let server = servers[i]
            try {
                yt = await yta(vid.url, server)
                yt2 = await ytv(vid.url, server)
                usedServer = server
                break
            } catch (e) {
                m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nmencoba server lain...'}`)
            }
        }
        if (yt === false) return 
        if (yt2 === false) return 
        let { dl_link, thumb, title, filesize, filesizeF } = yt
        await this.send2ButtonLoc(m.chat, await (await fetch(thumb)).buffer(), `
𝗣𝗹𝗮𝘆 𝗬𝗼𝘂𝗧𝘂𝗯𝗲

*ᴛɪᴛᴜʟᴏ:* ${title}
*ᴘᴇsᴏ ᴅᴇ ᴀᴜᴅɪᴏ:* ${filesizeF}
*ᴘᴇsᴏ ᴅᴇ ᴠɪᴅᴇᴏ:* ${yt2.filesizeF}
*Server y2mate:* ${usedServer}

ᴇsᴘᴇʀᴇ sᴜ ᴘᴇᴅɪᴅᴏ ᴘᴏʀ ғᴀᴠᴏʀ...
`.trim(), 'ᴜɴʀᴀᴠᴇʟ-ʙᴏᴛ', 'Audio', `.yta ${vid.url}`, 'Video', `.yt ${vid.url}`)
    }

}

handler.limit = true
module.exports = handler