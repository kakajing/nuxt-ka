import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin/'
// 请求地址
const api = {
    accessToken: base + 'token?grant_type=client_credential'
}

export default class Wechat {
    constructor (opts) {
        this.opts = Object.assign({}, opts)

        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken

        this.fetchAccessToken()
    }

    async request (options) {
        options = Object.assign({}, options, {json: true})
    
        try {
          const response = await request(options)
          console.log(response)   
          console.log('----------')
          return response
        } catch (error) {
          console.error(error)
        }
      }

    // 获取token
    async fetchAccessToken () {
        // 获取当前token
        let data = await this.getAccessToken()
        // 验证token是否正确
        if (!this.isValidAccessToken(data)) {
            data = await this.updateAccessToken()
        }

        await this.saveAccessToken(data)
        return data
    }

    // 更新token
    async updateAccessToken () {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
    
        const data = await this.request({url: url})
        const now = (new Date().getTime())
        const expiresIn = now + (data.expires_in - 20) * 1000
    
        data.expires_in = expiresIn
    
        return data
      }

    // 验证token
    isValidAccessToken (data) {
        if (!data || !data.accessToken || !data.expires_in) {
            return false
        }
        const expiresIn = data.expires_in
        const now = (new Date().getTime())

        if (now < expiresIn) {
            return true
        } else {
            return false
        }
    }
}