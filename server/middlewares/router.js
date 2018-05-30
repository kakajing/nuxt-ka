import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import {resolve} from 'path'

export const router = app => {
    const router = new Router()

    
    router.all('/wx', wechatMiddle(config.wechat, reply))

    router.get('/upload', async (ctx, next) => {
        let mp = require('../wechat')
        let client = mp.getWechat()

        const news = {
            articles: [
                {
                    "title": 'SSR1',
                    "thumb_media_id": 'MS9ix5MrmsSADOa6HKBpofmkA-LY8ddiEljpegn2P2M',
                    "author": 'kakajing',
                    "digest": '无摘要',
                    "show_cover_pic": 1,
                    "content": '无内容',
                    "content_source_url": 'https://www.baidu.com/'
                },
                {
                    "title": 'SSR2',
                    "thumb_media_id": 'MS9ix5MrmsSADOa6HKBpofmkA-LY8ddiEljpegn2P2M',
                    "author": 'kakajing',
                    "digest": '无摘要',
                    "show_cover_pic": 0,
                    "content": '无内容',
                    "content_source_url": 'https://www.baidu.com/'
                }
            ]
        }
        const data = await client.handle('uploadMaterial', 'news',  news, {})
        console.log(data)
        console.log('#################')
    })
    
    app
        .use(router.routes())
        .use(router.allowedMethods())
}