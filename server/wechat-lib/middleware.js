import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'


export default function (opts, reply) {
    return async function wechatMiddel (ctx, next) {       
        const token = opts.token
        // 参数
        const {signature, nonce, timestamp, echostr} = ctx.query

        // 对参数进行排序加密
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)

        if (ctx.method === 'GET') {
            if (sha === signature) {
                ctx.body = echostr
            } else {
                ctx.body = 'Failed'
            }
        } else if (ctx.method === 'POST') {
            if (sha !== signature) {
                ctx.body = 'Failed'
                return false
            }
            

            // 以字符串的形式获取数据
            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb',
                encoding: ctx.charset
            })

            const content = await util.parseXML(data)
            
            console.log(content)
            console.log('==================')

            ctx.weixin = {}

            await reply.apply(ctx, [ctx, next])

            const replyBody = ctx.body
            const msg = ctx.weixin
            
            console.log(replyBody)
            console.log('++++++++++++++++++++')

            // 被动回复消息模板
            const xml = `<xml>
            <ToUserName><![CDATA[${content.xml.FromUserName[0]}]]></ToUserName>
            <FromUserName><![CDATA[${content.xml.ToUserName[0]}]]></FromUserName>
            <CreateTime>12345678</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[${replyBody}]]></Content>
            </xml>`

            ctx.status = 200
            ctx.type = 'application/xml'
            ctx.body = xml
        }
    }
}