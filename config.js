let fs = require('fs')
let chalk = require('chalk')
const fetch = require("node-fetch");
const success = chalk.bold.green
const received = chalk.bold.cyan
const error = chalk.bold.red


global.owner = ['5493865362492','554988791601'] // Pon tu número aquí
global.mods = ['50662085665'] // ¿Quieres ayuda?
global.prems = [] // El usuario Premium tiene un límite ilimitado
global.APIs = {
// Contoh Penambahan Rest Api Yang Akan Digunakan
// Prefix: 'Alamat Url Website Rest Api',
  bx: 'https://bx-hunter.herokuapp.com',
  dhnjing: 'https://dhnjing.xyz',
  hardianto: 'https://hardianto-chan.herokuapp.com',
  jonaz: 'https://jonaz-api-v2.herokuapp.com',
  neoxr: 'https://neoxr-api.herokuapp.com',
  nzcha: 'http://nzcha-apii.herokuapp.com',
  bg: 'http://bochil.ddns.net',
  fdci: 'https://api.fdci.se',
  bsbt: 'https://bsbt-api-rest.herokuapp.com',
  nrtm: 'https://nurutomo.herokuapp.com',
  pencarikode: 'https://pencarikode.xyz',
  xteam: 'https://api.xteam.xyz',
  zahir: 'https://zahirr-web.herokuapp.com',
  zekais: 'http://zekais-api.herokuapp.com',
  zeks: 'https://api.zeks.xyz',
  leys: 'https://leyscoders-api.herokuapp.com',
  hardianto: 'https://hardianto-chan.herokuapp.com',
  lol: 'https://api.lolhuman.xyz',
  vh: 'http://api.vhtear.com',
}
global.APIKeys = { 
// Contoh Penambahan Rest Api + Apikey Yang Akan Digunakan
// 'Alamat Url Website Rest Api': 'Apikey',
  'https://bx-hunter.herokuapp.com': 'Ikyy69',
  'https://bsbt-api-rest.herokuapp.com': 'benniismael',
  'https://hardianto-chan.herokuapp.com': 'hardianto',
  'https://neoxr-api.herokuapp.com': 'yntkts',
  'https://pencarikode.xyz': 'pais',
  'https://api.xteam.xyz': 'cristian9407',
  'http://api.vhtear.com': 'HIROZTWO',
  'https://api.lolhuman.xyz': 'HIRO',
  'https://zahirr-web.herokuapp.com': 'zahirgans',
  'https://api.zeks.xyz': 'apivinz',
  'https://leyscoders-api.herokuapp.com': 'dappakntlll',
  'https://hardianto-chan.herokuapp.com': 'hardianto'
}

// Sticker WM
global.packname = 'Nana-MD'
global.author = 'Adul Alhy'

global.sessionid = '48736705854:2Tq6joffmVDzaS:24' // ID de sesión de Instagram, puede cambiar con su propia sesión
global.multiplier = 69 // Cuanto mayor sea el número / valor, entonces el aumento de nivel será más difícil
global.wait = '_*Espere un momento . . . .*_' // Mensaje mientras se carga/espera
global.eror = '_*El servidor está experimentando un error { Error:404 }*_' // Mensaje si tiene un error
global.fla = ''
global.getBuffer = getBuffer


global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🎁',
      mythic: '🗳️',
      legendary: '🗃️',
      pet: '🎁',
      sampah: '🗑',
      armor: '🥼',
      sword: '⚔️',
      kayu: '🪵',
      batu: '🪨',
      string: '🕸️',
      kuda: '🐎',
      kucing: '🐈' ,
      anjing: '🐕',
      petFood: '🍖',
      gold: '👑',
      emerald: '💚'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}
function getBuffer(buffer) {
return ez(buffer).then(a => a.buffer())
}  
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})