import mongoose from 'mongoose'
import config from '../config'
import {resolve} from 'path'
import fs from 'fs'
import R from 'ramda'

const models = resolve(__dirname, '../database/schema') 

// 同步读入模型文件
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(resolve(models, file)))

const formatData = R.map(i => {
  i._id = i.nmId
  return i
})

let wikiHouses = require(resolve(__dirname, '../../completeHouses.json'))
let wikiCharacters = require(resolve(__dirname, '../../completeCharacters.json'))

wikiCharacters = formatData(wikiCharacters)

export const database = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)

  // 连接中断
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })
  // 出错
  mongoose.connection.on('error', err => {
    console.error(err)
  })
  // 打开
  mongoose.connection.on('open', async () => {
    console.log('数据库连接成功 ', config.db)

    const WikiHouse = mongoose.model('WikiHouse')
    const WikiCharacter = mongoose.model('WikiCharacter')

    const existWikiHouses = await WikiHouse.find({}).exec()
    const existWikiCharacters = await WikiCharacter.find({}).exec()

    if (!existWikiHouses.length) WikiHouse.insertMany(wikiHouses)
    if (!existWikiCharacters.length) WikiCharacter.insertMany(wikiCharacters)
    
  })
}