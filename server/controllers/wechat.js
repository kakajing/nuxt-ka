import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import config from '../config'
import { getParamsAsync } from '../wechat-lib/pay'
import api from '../api'

// 签名
export async function signature (ctx, next) {
  let url = ctx.query.url
  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)

  const params = await api.wechat.getSignatureAsync(url)

  ctx.body = {
      success: true,
      params: params
  }
}

// 拼接跳转的目标地址
export async function redirect (ctx, next) {
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  // 参数
  const { visit, id } = ctx.query
  const params = id ? `${visit}_${id}` : visit
  
  const url = api.wechat.getAuthorizeURL(scope, target, params)

  ctx.redirect(url)
}

// 接收Oauth
export async function oauth (ctx, next) {
  // 客户端传过来的地址
  const url = ctx.query.url
  // 解析url
  const urlObj = urlParse(decodeURIComponent(url))
  const params = queryParse(urlObj.query)
  const code = params.code

  const user = await api.wechat.getUserByCode(code)

  ctx.session.user = user
  
  ctx.body = {
    success: true,
    user: user
  }
}

export async function wechatPay (code) {
  const ip = ctx.ip.replace('::ffff:', '')
  const session = ctx.session
  const { productId, name, phoneNumber, address } = ctx.request.body

  const product = await api.product.findProduct(productId)

  if (!product) {
    return (ctx.body = {
      success: false,
      err: '这个宝贝不在了'
    })
  }

  try {
    let user = await api.user.findUserByUnionId(session.user.unionid).exec()

    if (!user) {
      user = await api.user.saveFromSession(session)
    }

    const orderParams = {
      body: product.title,
      attach: '公众号周边手办支付',
      out_trade_no: 'Product' + (+new Date),
      spbill_create_ip: ip,
      // total_fee: product.price * 100,
      total_fee: 0.01 * 100,
      openid: session.user.unionid,
      trade_type: 'JSAPI'
    }

    // 生成预支付订单
    const order = await getParamsAsync(orderParams)
    // 生成订单
    const payment = await api.payment.create(user, product, order, '公众号', {
      name,
      address,
      phoneNumber
    })

    ctx.body = {
      success: true,
      data: payment.order
    }
  } catch (e) {
    ctx.body = {
      success: false,
      err: e
    }
  }
}