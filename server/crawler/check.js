import { resolve } from 'path'
import R from 'ramda'
import { find } from 'lodash'
import fs from 'fs'

const characters = require(resolve(__dirname, '../database/json/character.json'))
const IMDbData = require(resolve(__dirname, '../database/json/imdb.json'))

const findNameInAPI = (item) => {
  return find(characters, {
    name: item.name
  })
}

const findPlayedByInAPI = (item) => {
  return find(characters, i => {
    return i.playedBy.includes(item.playedBy)
  })
}

const validData = R.filter(
  i => findNameInAPI(i) && findPlayedByInAPI(i)
)

const IMDb = validData(IMDbData)

console.log(IMDb.length)

fs.writeFileSync(resolve(__dirname, '../database/json/wikiCharacters.json'), JSON.stringify(IMDb, null, 2), 'utf8')