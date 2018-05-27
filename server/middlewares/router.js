import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'

export const router = app => {
    const router = new Router()

    // 接收微信服务器推送的get请求时可以获取到参数
    router.all('/wx', wechatMiddle(config.wechat, reply))

    
    app
        .use(router.routes())
        .use(router.allowedMethods())
}