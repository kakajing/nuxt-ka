import { controller, get, post, required } from '../decorator/router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'
import { signature, redirect, oauth, wechatPay } from '../controllers/wechat'

@controller('')
export class WechatController {
  @get('/wx')
  async wx (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)

    ctx.body = body
  }

  @post('/wx')
  async wxPost (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)

    ctx.body = body
  }

  @post('/wx-pay')
  @required({ body: ['productId', 'name', 'phoneNumber', 'address' ]})
  async createdOrder (ctx, next) {
    await wechatPay(ctx, next)
  }

  @get('/wx-signature')
  async wxSignature (ctx, next) {
    await signature(ctx, next)
  }

  @get('/wx-redirect')
  async wxRedirect (ctx, next) {
    await redirect(ctx, next)
  }

  @get('/wx-oauth')
  async wxOauth (ctx, next) {
    await oauth(ctx, next)
  }
}
