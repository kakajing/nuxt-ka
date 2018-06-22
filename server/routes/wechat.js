import { controller, get, post, required } from '../decorator/router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'
import { signature, redirect, oauth } from '../controllers/wechat'

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


export const router = app => {
    const router = new Router()

    router.all('/wx', wechatMiddle(config.wechat, reply))
    router.get('/wx-signature', signature)
    router.get('/wx-redirect', redirect)
    router.get('/wx-oauth', oauth)
    
    app
        .use(router.routes())
        .use(router.allowedMethods())
}