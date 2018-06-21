import rp from 'request-promise'
import R from 'ramda'
import { resolve } from 'path'
import fs from 'fs'
import _ from 'lodash'
import randomToken from 'random-token'
import { fetchImage } from '../lib/qiniu'

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const normalizedContent = content => _.reduce(content, (acc, item) => {
  if (item.text) acc.push(item.text)

  if (item.elements && item.elements.lenght) {
    let _acc = normalizedContent(item.elements)

    acc = R.concat(acc, _acc)
  }
  return acc
}, [])

// 数据处理
const normalizedSections = R.compose(
  R.nth(1),
  R.splitAt(1),
  R.map(i => ({
    level: i.level,
    title: i.title,
    content: normalizedContent(i.content)
  }))
)

// 获取id
const getWikiId = async data => {
  const query = data.cname || data.name
  const url = `http://zh.asoiaf.wikia.com/api/v1/Search/List?query=${encodeURI(query)}`

  let res
  try {
    res = await rp(url)
  } catch (e) {
    console.log(e)
  }

  res = JSON.parse(res)
  res = res.items[0]

  // console.log(res.id)
  return R.merge(data, res)
}

// 获取详情
const getWikiDetail = async data => {
  const { id } = data
  const url = `http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id}`
  let res
  try {
    res = await rp(url)
  } catch (e) {
    console.log(e)
  }

  res = JSON.parse(res)
  
  const getCNameAndIntro = R.compose(
    i => ({
      cname: i.title,
      intro: R.map(R.prop(['text']))(i.content)
    }),
    R.pick(['title', 'content']),
    R.nth(0),
    R.filter(R.propEq('level', 1)),
    R.prop('sections')
  )

  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections')
  )

  const cnameIntro = getCNameAndIntro(res)
  let sections = getLevel(res)
  let body = R.merge(data, getCNameAndIntro(res))

  sections = normalizedSections(sections)

  body.sections = sections
  body.wikiId = id

  return R.pick(['name', 'cname', 'playedBy', 'profile', 'images', 'nmId', 'chId', 'sections', 'intro', 'wikiId', 'words'], body) 

}

export const getWikiCharacters = async () => {
  let data = require(resolve(__dirname, '../../fullCharacters.json'))
  
  console.log(data.lenght)
  data = R.map(getWikiId, data)
  data = await Promise.all(data)
  // console.log('获取 wiki Id')
  // console.log(data[0])

  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)
  console.log('获取 wiki 详细资料')
  console.log(data[0])

  fs.writeFileSync('./finalCharacters.json', JSON.stringify(data, null, 2), 'utf8')
}

// 上传图片
export const fetchImageFromIMDb = async () => {
  let IMDbCharacters = require(resolve(__dirname, '../../finalCharacters.json'))

  // IMDbCharacters = [
  //   IMDbCharacters[0]
  // ]
  IMDbCharacters = R.map(async item => {
    try {
      if (item.profile.indexOf('http') === -1) {
        let key = `${item.nmId}/${randomToken(32)}`
        await fetchImage(item.profile, key) // 上传图片
        console.log(key)
        console.log(item.profile)
        console.log('upload done!')

        item.profile = key
      }
    
      for (let i = 0; i < item.images.length; i++) {
        let _key = `${item.nmId}/${randomToken(32)}`
        await fetchImage(item.images[i], _key)  // 上传剧照

        console.log(_key)
        console.log(item.images[i])
        await(100)
        item.images[i] = _key
      }
    } catch (e) {
      console.log(e)
    }
    return item
  })(IMDbCharacters)
  IMDbCharacters = await Promise.all(IMDbCharacters)

  fs.writeFileSync('./completeCharacters.json', JSON.stringify(IMDbCharacters, null, 2), 'utf8')
}

const HOUSES = [
  {
    name: 'House Stark of Winterfell',
    cname: '史塔克家族',
    words: 'Winter is Coming'
  },
  {
    name: 'House Targaryen',
    cname: '坦格利安家族',
    words: 'Fire and Blood'
  },
  {
    name: 'House Lannister of Casterly Rock',
    cname: '兰尼斯特家族',
    words: 'Hear Me Roar!'
  },
  {
    name: 'House Arryn of the Eyrie',
    cname: '艾林家族',
    words: 'As High as Honor'
  },
  {
    name: 'House Tully of the Riverrun',
    cname: '徒利家族',
    words: 'Family, Duty, Honor'
  },
  {
    name: 'House Greyjoy of Pyke',
    cname: '葛雷乔伊家族',
    words: 'We Do Not Sow'
  },
  {
    name: "House Baratheon of Storm's End",
    cname: '风息堡的拜拉席恩家族',
    words: 'Ours is the Fury'
  },
  {
    name: 'House Tyrell of Highgarden',
    cname: '提利尔家族',
    words: 'Growing Strong'
  },
  {
    name: 'House Nymeros Martell of Sunspear',
    cname: '马泰尔家族',
    words: 'Unbowed, Unbent, Unbroken'
  }
]

// 获取家族详细数据
export const getHouses = async () => {
  let data = R.map(getWikiId, HOUSES)
  data = await Promise.all(data)
  console.log(data[0])
  console.log('ID done! 开始获取 detail')

  data = R.map(getWikiDetail, data)
  data = await Promise.all(data)

  fs.writeFileSync('./wikiHouses.json', JSON.stringify(data, null, 2), 'utf8')
}

getHouses()