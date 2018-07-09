import { controller, get, post, required } from '../decorator/router'
import config from '../config'
import mongoose from 'mongoose'
import { openidAndSessionKey, WXBizDataCrypt } from '../wechat-lib/mina'

const User = mongoose.model('User')

@controller('/mina')
export class MinaController {
  @get('codeAndSessionKey')
  @required({ query: ['code']})
  async getCodeAndSessionKey (ctx, next) {
    const { code } = ctx.query
    let res = await openidAndSessionKey(code)

    ctx.body = {
      success: true,
      data: res
    }
  }

  // 获取用户信息
  @get('user')
  @required({ query: ['code', 'userInfo'] })
  async getUser (ctx, next) {
    const { code, userInfo } = ctx.query
    const minaUser = await openidAndSessionKey(code)

    let user = await User.findOne({openid}).exec()

    if (!user) {
      let pc = new WXBizDataCrypt(minaUser.sessionKey)
      let data = pc.decryptData(userInfo.encryptedData, userInfo.iv)

      try {
        user = await User.findOne({openid: data.openId})

        if (!user) {
          let _userData = userInfo.userInfo

          user = new User({
            avatarUrl: _userData.avatarUrl,
            nickName: _userData.nickName,
            unionid: data.unionid,
            openid: [minaUser.openid],
            sex: _userData.gender,
            country: _userData.country,
            province: _userData.province,
            city: _userData.city
          })

          await user.save()
        }
      } catch (e) {
        return (ctx.body = {
          success: false,
          err: e
        })
      }
    }
    ctx.body = {
      success: true,
      data: {
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        sex: user.sex
      }
    }
  }

  // 通过小程序登录
  @post('/login')
  @required({ body: ['code', 'avatarUrl', 'nickName'] })
  async login (ctx, next) {
    const { code, avatarUrl, nickName } = ctx.request.body

    try {
      const { openid, unionid } = await openidAndSessionKey(code)

      let user = await user.findOne({
        openid
      }).exec()

      if (!user) {
        user = new user({
          openid: [openid],
          nickName: nickName,
          unionid,
          avatarUrl
        })
        user = await user.save()
      } else {
        user.avatarUrl = avatarUrl
        user.nickName = nickName
        user = await user.save()
      }

      ctx.body = {
        success: true,
        data: {
          nickName: nickName,
          avatarUrl: avatarUrl
        }
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
