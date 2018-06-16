import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import fs from 'fs'

export const getIMDBCharacters = async () => {
  const options = {
    uri: 'https://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    transform: function (body) {
      return cheerio.load(body);
    }
  }

  let $ = await rp(options)

  let photos = []

  // console.log(typeof $('table.cast_list tr.odd, tr.even'))

  $('table.cast_list tr.odd, tr.even').each(() => {
    const nmIdDom = $(this).find('td.itemprop a')
    const nmId = nmIdDom.attr('href')
    const characterDom = $(this).find('td.character a')
    const name = characterDom.text()
    const chId = characterDom.attr('href')
    const playedByDom = $(this).find('td.itemprop span.itemprop')
    const playedBy = playedByDom.text()

    console.log(playedBy)

    const data = {
      nmId,
      chId,
      name,
      playedBy
    }
    photos.push(data)
  })

  console.log('共拿到 ' + photos.length + ' 条数据')
  
  const fn = R.compose(
    R.map(photo => {
      const reg1 = /\/name\/(.*?)\/\?ref/
      const reg2 = /\/title\/tt0944947\/characters\/(.*?)\/\?ref/
      const match1 = photo.nmId.match(reg1)
      const match2 = photo.chId.match(reg2)

      // console.log(match1)

      photo.nmId = match1[1]
      photo.chId = match2[3]
      
      return photo
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  )

  photos = fn(photos)

  console.log('清洗后，剩余 ' + photos.length + ' 条数据')

  fs.writeFileSync('./imdb.json', JSON.stringify(photos, null, 2), 'utf8')
}

export const fetchIMDbProfile = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)
  const img = $('a.poster img')
  let src = img.attr('src')

  if (src) {
    src = src.split('_V1').shift()
    src += '_V1.jpg'
  }
}

export const getIMDbProfile = async () => {
  const characters = require(__dirname, './wikiCharacters.json')

  for (let i = 0; i < characters.length; i++) {
    if(!characters[i].profile) {
      const url = `https://www.imdb.com/title/tt0944947/characters/${characters[i].chId}`
      console.log('正在爬取 ' + characters[i].name)

      const src = await fetchIMDbProfile(url)
      console.log('已经爬到 ' + src)
      characters[i].profile = src

      fs.writeFileSync('./imdbCharacters.json', JSON.stringify(characters, null, 2), 'utf8')

      await sleep(500)
    }  
  }
}

getIMDBCharacters()