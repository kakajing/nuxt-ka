import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
import fs from 'fs'
import { resolve } from 'path'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

// 获取imdb数据
export const getIMDBCharacters = async () => {
  const options = {
    uri: 'https://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    transform: function (body) {
      return cheerio.load(body);
    }
  }

  let $ = await rp(options)

  let photos = []
  $('table.cast_list tr.odd, tr.even').each(function() {
    var  nmIdDom = $('td.itemprop',this).find('a')
    var nmId = nmIdDom.attr('href')
    let characterDom =$('td.character',this).find('a').eq(0)
    let chId = characterDom.attr('href')
    let name = characterDom.text()
    let playedByDom = $('td.itemprop',this).find('a').find('span')
    let playedBy = playedByDom.text()

    photos.push({
      nmId,
      chId,
      name,
      playedBy
    })
  })

  console.log('共拿到 ' + photos.length + ' 条数据')
  
  const fn = R.compose(
    R.map(photo => {
      let reg1 = /\/name\/(.*?)\/\?ref/
      let match1 = photo.nmId.match(reg1)
      let str = photo.chId.split('/')[4] //拿到之后可能为空字符串，分割后会是undefined，那就做一次判断再继续切割
      if(str){
        str = str.split('?')[0]
      }

      photo.nmId = match1[1]
      photo.chId = str
      
      return photo
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  )
  
  photos = fn(photos)

  // console.log(photos)

  console.log('清洗后，剩余 ' + photos.length + ' 条数据')

  fs.writeFileSync('./imdb.json', JSON.stringify(photos, null, 2), 'utf8')
}

// 请求头像
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

// 获取imdb的人物头像
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

// 检查数据是否包含profile字段
const checkIMDbProfile = () => {
  const characters = require(__dirname, './imdbCharacters.json')
  const newCharacters = []

  characters.forEach((item) => {
    if (item.profile) {
      newCharacters.push(item)
    }
  })

  fs.writeFileSync('./validCharacters.json', JSON.stringify(newCharacters, null, 2), 'utf8')
}

const fetchIMDbImage = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }

  const $ = await rp(options)
  let images = []

  $('div.media_index_thumb_list a img').each(() => {
    let src = $(this).attr('src')

    if (src) {
      src = src.split('_V1').shift()
      srt += '_V1.jpg'
      images.push(src)
    }
  })
  return images
}

// 获取角色剧照
export const getIMDbImages = async () => {
  const characters = require(__dirname, './wikiCharacters.json')

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `https://www.imdb.com/title/tt0944947/characters/${characters[i].chId}?ref_=ttfc_fc_cl_t1#quotes`
      console.log('正在爬取 ' + characters[i].name)
      const images = await fetchIMDbImage(url)
      
      console.log('已经爬到 ' + images.length)

      characters[i].images = images
      fs.writeFileSync('./fullCharacters.json', JSON.stringify(characters, null, 2), 'utf8')

    }
  }
}

getIMDBCharacters()