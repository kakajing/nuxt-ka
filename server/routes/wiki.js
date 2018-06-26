import api from '../api'
import { controller, get, post } from '../decorator/router'
import mongoose from 'mongoose'

const WikiHouse = mongoose.model('WikiHouse')
const WikiCharacter = mongoose.model('WikiCharacter')

@controller('/wiki')
export class WechatController {
  // 获取家族数据
  @get('/houses')
  async getHouses (ctx, next) {
    const data = await api.wiki.getHouses()
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

  // 获取家族详细资料
  @get('/houses/:_id')
  async getHouse (ctx, next) {
    const { params } = ctx
    const { _id } = params

    if (!_id) return (ctx.body = {sucess: false, err: '_id is required'})

    const data = await api.wiki.getHouse(_id)
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

  @get('/characters')
  async getCharacters (ctx, next) {
    let { limit = 20 } = ctx.query

    const data = await api.wiki.getCharacters(limit)
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

  @get('/characters/:_id')
  async getCharacter (ctx, next) {
    const { params } = ctx
    const { _id } = params

    if (!_id) return (ctx.body = {sucess: false, err: '_id is required'})

    const data = await getCharacter(_id)
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

}
