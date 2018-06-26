// import wiki from '../api/wiki'
import { controller, get, post } from '../decorator/router'
import mongoose from 'mongoose'

const WikiHouse = mongoose.model('WikiHouse')
const WikiCharacter = mongoose.model('WikiCharacter')

@controller('/wiki')
export class WechatController {
  // 获取家族数据
  @get('/houses')
  async getHouses (ctx, next) {
    const data = await WikiHouse
      .find({})
      .populate({
        path: 'swornMembers.character',
        select: '_id name cname profile'
      })
      .exec()
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

    const data = await WikiHouse
      .findOne({_id: _id})
      .populate({
        path: 'swornMembers.character',
        select: '_id name cname nmId'
      })
      .exec()

    ctx.body = {
      data: data,
      sucess: true
    }
  }

  @get('/characters')
  async getCharacters (ctx, next) {
    let { limit = 20 } = ctx.query

    const data = await WikiCharacter
      .find({})
      .limit(Number(limit))
      .exec()
     
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

    const data = await WikiCharacter
      .findOne({_id: _id})
      .exec()
      
    ctx.body = {
      data: data,
      sucess: true
    }
  }

}
