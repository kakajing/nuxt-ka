import rp from 'request-promise'
import _ from 'lodash'
import fs from 'fs'
import { resolve } from 'path'

let characters = []

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const getAPICharacters = async (page = 1) => {
  const url = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=50`

  console.log('正在爬第 ' + page + ' 页数据')

  let body = await rp(url)

  body = JSON.parse(body)

  characters = _.union(characters, body)

  console.log('现有' + characters.length + ' 条数据')

  if (body.length < 50) {
    console.log('爬完了')
  } else {
    fs.writeFileSync('./character.json', JSON.stringify(characters, null, 2), 'utf8')
    await sleep(1000)
    page++
    getAPICharacters(page)
  }
}

getAPICharacters()