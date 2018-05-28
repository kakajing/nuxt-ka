const tip = '亲爱的黑虎，欢迎来到青青大草原\n' + '点击 <a href="http://coding.imooc.com">一起放风筝啊</a>'

export default async (ctx, next) => {
    const message = ctx.weixin

    console.log(message)

    if (message.MsgType === 'text') {
        ctx.body = message.Content
    } else if (message.MsgType === 'image') {
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'voice') {
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'video') {
        ctx.body = {
            title: message.ThumbMediaId,
            type: 'video',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'location') {
        ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
    } else if (message.MsgType === 'link') {
        ctx.body = [{
            title: message.Title,
            description: message.Description,
            picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/8U36YTkvibWtRgIHqiacSLeSJpANdafutLibrEvXlLQNhxToj45wyj5FemhzRRppp4mC8nRFd9n4kV3vgCXXDRXicw/0',
            url: message.url
        }]
        
    }
    
}