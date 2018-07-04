import api from '../api'
import { controller, get, post, del, put, required } from '../decorator/router'

@controller('/')
export class adminController {
  @post('login')
  @required({body: ['email', 'password']})
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    const data = await api.admin.login(email, password)
    const { user, match } = data

    if (match) {
      if (user.role !== 'admin') {
        return (ctx.body = {
          success: false,
          err: '来错地方了'
        })
      }

      ctx.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl
      }

      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl
        }
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码错误'
    })
  }

  @post('logout')
  async logout (ctx, next) {
    ctx.session = null
    ctx.body = {
      success: true
    }
  }

}
