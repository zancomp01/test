const {
  ytdl,
  tiktok,
  ig
} = require('./downloader.js')
const {
  default: makeWASocket,
  useSingleFileAuthState,
  downloadContentFromMessage,
  DisconnectReason
} = require('@danielteodoro/baileys-md')
const pino = require('pino')
const {
  state,
  saveState
} = useSingleFileAuthState(`./ozan.json`)
const fs = require('fs')
const {
  getBuffer,
  fetchJson,
  yts
} = require('./func.js')
const webp = require('webp-converter')
const execa = require('execa')
const moment = require('moment-timezone')

lol = 'rey2k21'
//OOOOOOOOOOOOOOOOO

async function start() {
  const conn = makeWASocket({
    printQRInTerminal: true,
    auth: state
  })

  conn.ev.on('connection.update', (update) => {
    const {
      connection,
      lastDisconnect
    } = update
    if (connection === 'close') {
      lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log('connection logged out...')
    }
  })

  conn.ev.on('messages.upsert', async mek => {
    try {
      mek = mek.messages[0]
      if (!mek.message) return
      const type = Object.keys(mek.message)[0]
      const from = mek.key.remoteJid
      const fromMe = mek.key.fromMe
      const pushname = mek.pushName
      const time = moment().tz('asia/jakarta').format('HH:mm')
      const body = "conversation" === type ? mek.message.conversation : "imageMessage" == type ? mek.message.imageMessage.caption : "videoMessage" == type ? mek.message.videoMessage.caption : "extendedTextMessage" == type ? mek.message.extendedTextMessage.text : "buttonsResponseMessage" == type ? mek.message.buttonsResponseMessage.selectedButtonId : "listResponseMessage" == type ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : "templateButtonReplyMessage" == type ? mek.message.templateButtonReplyMessage.selectedId : "messageContextInfo" === type && (mek.message.buttonsResponseMessage?.selectedButtonId || mek.message.listResponseMessage?.singleSelectReply.selectedRowId || ("listResponseMessage" == type ? mek.msg.singleSelectReply.selectedRowId : "") || mek.msg.text || mek.msg.caption || mek.msg) || "";
      prefix = /^[°•π÷×¶∆£¢€¥®™=|~!#$%^&.?/\\©^z+*@,;]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™=|~!#$%^&.?/\\©^z+*,;]/gi) : '-'
      const isCmd = body.startsWith(prefix)
      const command = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : ''
      const args = body.trim().split(/ +/).slice(1),
       q = args.join(" ");
      const reply = e => {
        conn.sendMessage(from, {
          text: e
        }, {
          quoted: mek
        })
      };
      const getRandom = o => `${Math.floor(1e4*Math.random())}${o}`;
      //////////////////////////
      const content = JSON.stringify(mek.message),
        isImage = "imageMessage" == type,
        isVideo = "videoMessage" == type,
        isSticker = "stickerMessage" == type,
        isQuotedMsg = "extendedTextMessage" == type,
        isQuotedImage = !!isQuotedMsg && !!content.includes("imageMessage"),
        isQuotedAudio = !!isQuotedMsg && !!content.includes("audioMessage"),
        isQuotedDocument = !!isQuotedMsg && !!content.includes("documentMessage"),
        isQuotedVideo = !!isQuotedMsg && !!content.includes("videoMessage"),
        isQuotedSticker = !!isQuotedMsg && !!content.includes("stickerMessage");

      async function downloadAndSaveMediaMessage(e) {
        if ("image" === e) {
          var s = await downloadContentFromMessage(mek.message.imageMessage || mek.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, "image");
          let e = Buffer.from([]);
          for await (const a of s) e = Buffer.concat([e, a]);
          return e
        }
        if ("video" === e) {
          s = await downloadContentFromMessage(mek.message.videoMessage || mek.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, "video");
          let e = Buffer.from([]);
          for await (const a of s) e = Buffer.concat([e, a]);
          return e
        }
        if ("sticker" === e) {
          s = await downloadContentFromMessage(mek.message.stickerMessage || mek.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, "sticker");
          let e = Buffer.from([]);
          for await (const a of s) e = Buffer.concat([e, a]);
          return e
        }
        if ("audio" === e) {
          s = await downloadContentFromMessage(mek.message.audioMessage || mek.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, "audio");
          let e = Buffer.from([]);
          for await (const a of s) e = Buffer.concat([e, a]);
          return e
        }
      }

      const toWebp = async (op) => {
        try {
          p = getRandom('.webp')
          await webp.cwebp(op, p, "-q 100", logging = "-v")
          await conn.sendMessage(from, {
            sticker: {
              url: p
            }
          }, {
            quoted: mek
          })
          fs.unlinkSync(op)
          fs.unlinkSync(p)
        } catch {
          fs.unlinkSync(op)
        }
      }
      const isGroup = mek.key.remoteJid.endsWith('@g.us')
      const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
      const groupMembers = isGroup ? groupMetadata.participants : ''

      function format(seconds) {
        function pad(s) {
          return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60 * 60));
        var minutes = Math.floor(seconds % (60 * 60) / 60);
        var seconds = Math.floor(seconds % 60);

        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
      }

      sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      const text1 = q.split('|')[0]
      const text2 = q.split('|')[1]

      //////////////////////
      switch (command) {
        case 'ml':
          if (!text1) return reply(`*contoh:*
${prefix}ml 694929614|8776`)
          if (!text2) return reply(`*contoh:*
${prefix}ml 694929614|8776`)
          api = await fetchJson(`https://api.lolhuman.xyz/api/mobilelegend/${text1}/${text2}?apikey=${lol}`)
          reply(api.result)
          break
        case 'epep':
          if (!q) return reply(`*contoh:*
${prefix}epep xxx`)
          api = await fetchJson(`https://api.lolhuman.xyz/api/freefire/${q}?apikey=${lol}`)
          reply(api.result)
          break
        case 'pubg':
          if (!q) return reply(`*contoh:*
${prefix}pubg xxx`)
          api = await fetchJson(`https://api.lolhuman.xyz/api/pubg/${q}?apikey=${lol}`)
          reply(api.result)
          break
        case 'alay':
          if (!q) return reply(`*contoh:*
${prefix}alay Za bot`)
          api = await fetchJson(`https://api.lolhuman.xyz/api/alay?apikey=${lol}&text=${q}`)
          reply(api.result)
          break
        case 'kannagen':
          if (!q) return reply(`*contoh:*
${prefix}kannagen Za bot`)
          conn.sendMessage(from, {
            image: {
              url: `https://api.lolhuman.xyz/api/creator/kannagen?apikey=${lol}&text=${q}`
            }
          })
          break
        case 'pinterest':
        case 'pin':
          if (!q) return reply('masukan query')
          api = await fetchJson(`https://api.lolhuman.xyz/api/pinterest?apikey=${lol}&query=${q}`)
          conn.sendMessage(from, {
            image: {
              url: api.result
            }
          }, {
            quoted: mek
          })
          break
        case 'gimage':
        case 'image':
          if (!q) return reply('masukan query')
          buf = await getBuffer(`https://api.lolhuman.xyz/api/gimage?apikey=${lol}&query=${q}`)
          conn.sendMessage(from, {
            image: buf
          }, {
            quoted: mek
          })
          break
        case 'ss':
          if (!q) return reply('masukan link')
          conn.sendMessage(from, {
            image: {
              url: `https://api.lolhuman.xyz/api/ssweb?apikey=${lol}&url=${q}`
            }
          })
          break
        case 'pantun':
          api = await fetchJson(`https://api.lolhuman.xyz/api/random/pantun?apikey=${lol}`)
          reply(api.result)
          break
        case 'ig':
          if (!q) return reply('masukan link')
          api = await ig(q)
          y = await getBuffer(api.url)
          if (api.ext.includes('mp4')) {
            conn.sendMessage(from, {
              video: y
            }, {
              quoted: mek
            })
          } else {
            conn.sendMessage(from, {
              image: y
            }, {
              quoted: mek
            })
          }
          break
        case 'waifu':
          conn.sendMessage(from, {
            image: {
              url: `https://api.lolhuman.xyz/api/random/waifu?apikey=${lol}`
            },
            caption: `${pushname} 👉👈`
          }, {
            quoted: mek
          })
          break
        case 'waifu2':
          conn.sendMessage(from, {
            image: {
              url: `https://api.lolhuman.xyz/api/random2/waifu?apikey=${lol}`
            },
            caption: `${pushname} 👉👈`
          }, {
            quoted: mek
          })
          break
        case 'neko':
          conn.sendMessage(from, {
            image: {
              url: `https://api.lolhuman.xyz/api/random/neko?apikey=${lol}`
            },
            caption: `${pushname} 👉👈`
          }, {
            quoted: mek
          })
          break
        case 'neko2':
          conn.sendMessage(from, {
            image: {
              url: `https://api.lolhuman.xyz/api/random2/neko?apikey=${lol}`
            },
            caption: `${pushname} 👉👈`
          }, {
            quoted: mek
          })
          break
        case 'loli':
          w = await getBuffer(`https://api.lolhuman.xyz/api/random/loli?apikey=${lol}`)
          conn.sendMessage(from, {
            image: w,
            caption: `pedo:v`
          }, {
            quoted: mek
          })
          break
        case 'tiktok':
        case 'tt':
          if (!q) return reply('linknya cuy kata fawaz')
          but = [{
            index: 1,
            quickReplyButton: {
              displayText: `Watermark`,
              id: `.tiktokwm ${q}`
            }
          }, {
            index: 1,
            quickReplyButton: {
              displayText: `noWatermark`,
              id: `.tiktoknowm ${q}`
            }
          }, {
            index: 2,
            quickReplyButton: {
              displayText: `audio`,
              id: `.tiktokaudio ${q}`
            }
          }]
          conn.sendMessage(from, {
            text: time,
            templateButtons: but
          })
          break
        case 'tiktokwm':
          api = await tiktok(q)
          vid = await getBuffer(api.wm)
          conn.sendMessage(from, {
            video: vid,
            caption: api.title
          }, {
            quoted: mek
          })
          break

        case 'tiktoknowm':
          api = await tiktok(q)
          vid = await getBuffer(api.nowm)
          conn.sendMessage(from, {
            video: vid,
            caption: api.title
          }, {
            quoted: mek
          })
          break

        case 'tiktokaudio':
          api = await tiktok(q)
          vid = await getBuffer(api.aud)
          conn.sendMessage(from, {
            audio: vid,
            caption: api.title
          }, {
            quoted: mek
          })
          break
        case 'speedtest':
        case 'speed':
          reply('wait')
          var {
            stdout
          } = await execa('npx', ['speed-test', '-j']);
          reply(`ping: ${JSON.parse(stdout).ping} ms
download: ${JSON.parse(stdout).download} Mbps
upload: ${JSON.parse(stdout).upload} Mbps`)
          break
        case 'attp':
          conn.sendMessage(from, {
            sticker: {
              url: `https://xteam.xyz/attp?file&text=${q}`
            }
          }, {
            quoted: mek
          })
          break
          //case 'hidetag':
          //if (!isGroup && !fromMe) return reply('lol')
          //conn.sendMessage(from, { text : q ? q : '' , mentions: groupMembers.map(a => a.id)})
          //break
        case 'menu':
        case 'help':
        case '?':
        case 'm':
api = await fetchJson(`https://api.lolhuman.xyz/api/countdown/02/04/2022?apikey=${lol}`)
          conn.sendMessage(from, {
            text: `»▬▬«•●•»▬▬«
Hai *${pushname}* 🍵
${time} WIB
uptime: *${format(process.uptime())}*
_bot ini menggunakan_
_baileys-md_

»▬▬«•●•»▬▬«
countdown ramadhan 2022
*${api.result}*

»▬▬«•●•»▬▬«
.speedtest
.ss [ link ]
.ml [ id|server ] 
.pubg [ id ]
.epep [ id ]
.ramadhan

»▬▬«•●•»▬▬«
.waifu
.waifu2
.neko
.neko2
.loli [ nsfw ] nggk ad yg sfw 🗿

»▬▬«•●•»▬▬«
.sticker [ reply ]
.toimg [ reply ]
.attp
.kannagen [ query ]

»▬▬«•●•»▬▬«
.play [ query ]
.ytmp3 [ link ]
.ytmp4 [ link ]
.tiktok [ link ]
.tiktokwm
.tiktoknowm
.tiktokaudio
.ig [ link ]
.pinterest [ query ]
.gimage [ query ]

»▬▬«•●•»▬▬«
.meme
.darkjoke
.pantun
.alay [ query ]`
          }, {
            quoted: mek
          });
          break
case 'ramadhan':
api = await fetchJson(`https://api.lolhuman.xyz/api/countdown/02/04/2022?apikey=${lol}`)
reply(`ramadhan tinggal
*${api.result}*
lagi`)
break
        case 'meme':
          buf = await getBuffer(`https://api.lolhuman.xyz/api/meme/memeindo?apikey=${lol}`)
          conn.sendMessage(from, {
            image: buf
          }, {
            quoted: mek
          })
          break
        case 'darkjoke':
          buf = await getBuffer(`https://api.lolhuman.xyz/api/meme/darkjoke?apikey=${lol}`)
          conn.sendMessage(from, {
            image: buf
          }, {
            quoted: mek
          })
          break

        case 'sticker':
        case 's':
        case 'sticker':
          if (isImage || isQuotedImage) {
            gg = await downloadAndSaveMediaMessage('image')
            test = getRandom('.jpg')
            await fs.writeFileSync(test, gg)
            toWebp(test)
          } else {
            reply('reply gambar')
          }
          break
        case 'toimage':
        case 'toimg':
          if (isQuotedSticker) {
            api = await downloadAndSaveMediaMessage('sticker')
            conn.sendMessage(from, {
              image: api
            }, {
              quoted: mek
            })
          }
          break
        case 'play':
        case 'yts':
        case 'yt':
        case 'ytsearch':
          if (!q) return reply('masukan query')
          var api = await yts(q)
          menuBut = [{
            index: 1,
            quickReplyButton: {
              displayText: 'audio',
              id: `.ytmp3 https://youtube.com/watch?v=${api.id}`
            }
          }, {
            index: 2,
            quickReplyButton: {
              displayText: 'video',
              id: `.ytmp4 https://youtube.com/watch?v=${api.id}`
            }
          }]
          hh = await getBuffer(api.thumbnail.url)
          await conn.sendMessage(from, {
            caption: `»▬▬«•●•»▬▬«
*_${api.title}_*

_${api.uploadedAt}_`,
            location: {
              jpegThumbnail: hh
            },
            templateButtons: menuBut,
            footer: pushname
          }, )
          break
        case 'ytmp3':
        case 'mp3':
          if (!q) return reply('masukan link')
          api = await ytdl(q)
          if (api.mp3.size.replace(' MB', '') < 55) {
            reply(`downloading ${api.mp3.size}`)
            buf = await getBuffer(api.mp3.link)
            conn.sendMessage(from, {
              document: buf,
              mimetype: 'audio/mpeg',
              fileName: `${api.title}.mp3`
            }, {
              quoted: mek
            })
          } else if (api.mp3.size.replace(' KB', '') < 1024) {
            reply(`downloading ${api.mp3.size}`)
            buf = await getBuffer(api.mp3.link)
            conn.sendMessage(from, {
              document: buf,
              mimetype: 'audio/mpeg',
              fileName: `${api.title}.mp3`
            }, {
              quoted: mek
            })
          } else {
            reply('file over 55 MB')
          }
          break
        case 'ytmp4':
        case 'mp4':
          if (!q) return reply('masukan link')
          api = await ytdl(q)
          if (api.mp4.size.replace(' MB', '') < 55) {
            reply(`downloading ${api.mp4.size}`)
            buf = await getBuffer(api.mp4.link)
            conn.sendMessage(from, {
              video: buf
            }, {
              quoted: mek
            })
          } else if (api.mp4.size.replace(' KB', '') < 1024) {
            reply(`downloading ${api.mp4.size}`)
            buf = await getBuffer(api.mp4.link)
            conn.sendMessage(from, {
              video: buf
            }, {
              quoted: mek
            })
          } else {
            reply('file over 55 MB')
          }
          break
        default:
      }
    } catch (e) {
      console.log(e)
    }
  })

  //OOOOOOOOOOOOOOOOO
  conn.ev.on("group-participants.update", (async o => {
    console.log(o);
    try {
      let t = await conn.groupMetadata(o.id),
        e = o.participants;
      for (let n of e) {
        try {
          ppuser = await conn.profilePictureUrl(n, "image")
        } catch {
          ppuser = "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg"
        }
        try {
          ppgroup = await conn.profilePictureUrl(o.id, "image")
        } catch {
          ppgroup = "https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg"
        }
        "add" == o.action ? conn.sendMessage(o.id, {
          image: {
            url: ppuser
          },
          contextInfo: {
            mentionedJid: [n]
          },
          caption: `Welcome To ${t.subject} @${n.split("@")[0]}`
        }) : "remove" == o.action && conn.sendMessage(o.id, {
          image: {
            url: ppuser
          },
          contextInfo: {
            mentionedJid: [n]
          },
          caption: `@${n.split("@")[0]} Leaving From ${t.subject}`
        })
      }
    } catch (o) {
      console.log(o)
    }
  }));

  conn.ev.on("creds.update", saveState);
}
start()
fs.watchFile(require.resolve(__filename), (() => {
  fs.unwatchFile(require.resolve(__filename)), console.log(`\n\n\n\n\nFile ${__filename} Telah di update\n\n\n\n\n`), delete require.cache[require.resolve(__filename)], require(require.resolve(__filename))
}));
