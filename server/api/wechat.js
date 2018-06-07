import {getWechat, getOAuth} from '../wechat'

const client = getWechat()

// 获取signature
export async function getSignatureAsync (url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket, url)
  params.appId = client.appID

  return params
} 

// 跳转的url
export function getAuthorizeURL (...args) {
  const oauth = getOAuth()

  return oauth.getAuthorizeURL(...args)
}

// 获取用户信息
export async function getUserByCode (code) {
  // oauth实例
  const oauth = getOAuth()

  const data = await oauth.fetchAccessToken(code)
 
  const user = await oauth.getUserInfo(data.access_token, data.openid)

  return user
}