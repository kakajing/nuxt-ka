import * as api from '../api'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import config from '../config'

// 签名
export async function signature (ctx, next) {
  let url = ctx.query.url
  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)

  const params = await api.getSignatureAsync(url)

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
  const {a, b} = ctx.query
  const params = `${a}_${b}`

  const url = api.getAuthorizeURL(scope, target, params)

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

  const user = await api.getUserByCode(code)
  
  ctx.body = {
    success: true,
    user: user
  }
}