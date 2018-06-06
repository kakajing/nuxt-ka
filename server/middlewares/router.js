import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'
import { signature, redirect, oauth } from '../controllers/wechat';

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