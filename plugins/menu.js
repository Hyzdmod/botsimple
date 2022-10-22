const { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys')
let fs = require('fs')
let path = require('path')
let levelling = require('../lib/levelling')
let totalfeature = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length;let totalfeature = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length;
let tags = {
  'main': 'MENU UTAMA',
  'game': 'MENU GAME',
  'rpg': 'MENU RPG',
  'xp': 'MENU EXP',
  'group': 'MENU GROUP',
  'owner': 'MENU OWNER',
  'fun': 'MENU FUN',
  'sticker': 'MENU CONVERT',
  'maker': 'MENU MAKER',
  'github': 'MENU GITHUB',
  'internet': 'INTERNET',
  'kerang': 'MENU KERANG',
  'anime': 'MENU ANIME',
  'nsfw': 'MENU NSFW',
  'tools': 'MENU TOOLS',
  'advanced': 'ADVANCED',
  'privasi': 'MENU PRIVASI',
  'info': 'MENU INFO',
}
const defaultMenu = {
  before: `
╭────ꕥ %me ꕥ────
│✾ Version: %version
│✾ Library: Baileys-MD
│✾ Runtime: %uptime
╰❑
╭─❑ 「 INFO USER 」 ❑──
│ ✾ Name: %name
│ ✾ Total Features : ${totalfeature}
│ ✾ Limit: %limit
│ ✾ Money: %money
│ ✾ Exp: %totalexp
│ ✾ Level: %level
│ ✾ Role: %role
│ ✾ Number of Registered Users : %rtotalreg From %totalreg
╰❑
╭─❑ 「 INFORMASI 」 ❑──
│ Bot ini masih tahap beta
│ apabila ada bug/eror harap
│ lapor ke owner
╰❑
%readmore`.trimStart(),
  header: '╭─「 %category 」',
  body: '│ • %cmd %islimit %isPremium',
  footer: '╰────\n',
  after: `
*%npmname@^%version*
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
   let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender 
    let user = global.db.data.users[who]
    let { exp, limit, level, money, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = m.pushName
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
  let buttons = [
{buttonId: `.owner`, buttonText: {displayText: 'ᴄʀᴇᴀᴅᴏʀ'}, type: 1}
]
let buttonMessage = {
document: fs.readFileSync('../lib/tes.xlsx'),
mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
jpegThumbnail: fs.readFileSync('./src/nana2.jpg'),
//mentions: [],
fileName: `ʙɪᴇɴᴠᴇɴɪᴅᴏ ᴀʟ ᴍᴇɴᴜ`,
fileLength: 99999999999999,
pageCount: 666,
caption: text.trim(),
footer: '© ' + after,
buttons: buttons,
headerType: 4,
contextInfo:{externalAdReply:{
showAdAttribution: true,
title: `ʙʏ ʜʏᴢᴅ`,
body: `ᴘ`,
mediaType:2,
thumbnail: fs.readFileSync('./src/nana2.jpg'),
sourceUrl: "0",
mediaUrl: "0",
}}
}
simple.sendMessage(m.chat, buttonMessage, {quoted:m})
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    //throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
