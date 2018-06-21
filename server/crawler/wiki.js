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

fetchImageFromIMDb()