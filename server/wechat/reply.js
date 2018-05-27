const tip = '亲爱的黑虎，欢迎来到青青大草原\n' + '点击 <a href="http://coding.imooc.com">一起放风筝啊</a>'

export default async (ctx, next) => {
    const message = ctx.weixin
    console.log(message)
    ctx.body = tip
}