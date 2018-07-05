import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'

const api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',    // 用户同意授权
  accessToken: base + 'oauth2/access_token?',                           // 获取网页授权access_token
  userInfo: base + 'userinfo?'                                          // 获取用户信息
}

export default class WechatOAuth {
    constructor (opts) {
        this.appID = opts.appID
        this.appSecret = opts.appSecret
    }

    async request (options) {
      options = Object.assign({}, options, {json: true})
  
      try {
        const response = await request(options)
        // console.log(response)  
        return response
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 拼接地址拿到code
     * @param {*} scope 
     * @param {跳转地址} target 
     * @param {*} state 
     */
    getAuthorizeURL (scope = 'snsapi_base', target, state) {
      const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
      
      return url
    }


    // 获取access_token
    async fetchAccessToken (code) {
      const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
      const data = await this.request({url: url})
  
      return data
    }

  // 获取用户信息
  async getUserInfo (token, openID) {
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=zh_CN`
    const data = await this.request({url: url})

    return data
  }

}