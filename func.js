const axios = require('axios')
const YouTube = require("youtube-sr").default
const https = require('https')
const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
})

exports.getBuffer = async t => {
    var j = await instance.get(t, { responseType: 'arraybuffer' })
    return j.data
}

exports.fetchJson = async t => {
    var q = await instance.get(t)
    return q.data
}


exports.yts = async a => {
    var f = await YouTube.search(a, { limit: 1 })
    return f[0]
}
