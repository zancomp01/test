const axios = require('axios')



aiodl =async (url) => {
  q = await axios({
    method: 'post',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.74 Safari/537.36',
      'cookie': 'pll_language=en; PHPSESSID=40e5744ef4fea3c6d508f4e4b9e83188'
    },
    url: 'https://aiovideodl.ml/wp-json/aio-dl/video-data/',
    data: `url=${encodeURI(url)}&token=ae77a05ef075bd8f9c616fb23f302195b5c09d99c33639b04d33f375548af214`
  })
  return q.data
}

tiktok = async (url) => {
  q = await aiodl(url)
  for (i of q.medias) {
    if (i.quality.includes('water')) {
      e = i.url
    } else if (i.quality.includes('hd')) {
      r = i.url
    } else {
      t = i.url
    }
  }
  return {
    title: q.title,
    wm: e,
    nowm: r,
    aud: t
  }
}

ytdl = async (url) => {
  q = await axios({
    method: 'post',
    url: 'https://9convert.com/api/ajaxSearch/index',
    data: `query=${encodeURI(url)}&vt=home`
  })
  w = await axios({
    method: 'post',
    url: 'https://9convert.com/api/ajaxConvert/convert',
    data: `vid=${q.data.vid}&k=${encodeURIComponent(q.data.links.mp3.mp3128.k)}`
  })
  e = await axios({
    method: 'post',
    url: 'https://9convert.com/api/ajaxConvert/convert',
    data: `vid=${q.data.vid}&k=${encodeURIComponent(q.data.links.mp4[18].k)}`
  })
  return {
    title: q.data.title,
    stats: q.data.status,
    mp3: {
      size: q.data.links.mp3.mp3128.size,
      link: w.data.dlink
    },
    mp4: {
      size: q.data.links.mp4[18].size,
      link: e.data.dlink
    }
  }
}

ig = async (url) => {
  q = await aiodl(url)
  for (i of q.medias) {
    if (i.quality.includes('hd')) {
      return { 
        url: i.url,
        ext: i.extension
      }
    }
  }
}


module.exports = {
  ytdl,
  tiktok,
  ig
}
