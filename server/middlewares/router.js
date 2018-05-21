import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'

export const router = app => {
    const router = new Router()

    // 接收微信服务器推送的get请求时可以获取到参数
    router.get('/wx', (ctx, next) => {
        const token = config.wechat.token
        // 参数
        const {
            // 签名
            signature,
            nonce,
            timestamp,
            echostr
        } = ctx.query

        // 对参数进行排序加密
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)

        console.log(sha === signature)
        console.log('===========')
        if (sha === signature) {
            ctx.body = echostr
        } else {
            ctx.body = 'Failed'
        }
    })
    // router.post('/wechat-hear', (ctx, next) => {

    // })

    app.use(router.routes())
    app.use(router.allowedMethods())
}