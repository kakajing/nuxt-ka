import {getWechat, getOAuth} from '../wechat'
import mongoose from 'mongoose'

const User = mongoose.model('User')

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

  console.log('oauth')
  console.log(oauth)
  return oauth.getAuthorizeURL(...args)
}

// 获取用户信息
export async function getUserByCode (code) {
  // oauth实例
  const oauth = getOAuth()

  console.log(oauth)

  const data = await oauth.fetchAccessToken(code)
  console.log(data)
 
  const user = await oauth.getUserInfo(data.access_token, data.openid)
  console.log('user')
  console.log(user)

  const existUser = await User.findOne({openid: data.openid}).exec()
  console.log('existUser')
  console.log(existUser)

  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      unionid: data.unionid,
      nickname: user.nickname,
      province: user.province,
      country: user.country,
      city: user.city,
      headimgurl: user.headimgurl,
      sex: user.sex
    })
    await newUser.save()
  }

  return user
}