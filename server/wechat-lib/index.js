import request from 'request-promise'
import formstream from 'formstream'
import fs from 'fs'
import * as _ from 'lodash'
import path from 'path'

const base = 'https://api.weixin.qq.com/cgi-bin/'
// 请求地址
const api = {
    accessToken: base + 'token?grant_type=client_credential',
    temporary: {
        upload: base + 'media/upload?',          // 新增临时素材
        fetch: base + 'media/get?'               // 获取临时素材
    },
    permanent: {
        upload: base + 'material/add_material?',   // 新增其他类型永久素材
        uploadNews: base + 'material/add_news?',   // 新增永久图文素材
        uploadNewsPic: base + 'media/uploadimg?',  // 上传图文消息内的图片
        fetch: base + 'material/get_material?',    // 获取永久素材
        del: base + 'material/del_material?',      // 删除永久素材
        update: base + 'material/update_news?',    // 修改永久图文素材
        count: base + 'material/get_materialcount?', // 获取素材总数
        batch: base + 'material/batchget_material?'  // 获取素材列表
    }
}

// 读取文件大小
function statFile (filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) reject(err)
            else resolve(stat)
        })
    })
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
        //   console.log(response)   
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

    // 上传动作
    async handle (operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = await this[operation](tokenData.access_token, ...args)
        const data = await this.request(options)

        return data
    }

    // 上传素材参数
    async uploadMaterial (token, type, material, permanent) {
        let form = {}
        let url = api.temporary.upload

        if (permanent) {
            url = api.permanent.upload

            _.extend(form, permanent)
        }

        if (type === 'pic') {
            url = api.permanent.uploadNewsPic
        }

        if (type === 'news') {
            url = api.permanent.uploadNews
            form = material
        } else {
            form.media = fs.createReadStream(material)
        }
        let uploadUrl = url + 'access_token=' + token

        if (!permanent) {
            uploadUrl += '&type=' + type
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }

        // 构建上传需要的对象
        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }

        if (type === 'news') {
            options.body = form
        } else {
            options.formData = form
        }

        return options

    }

    // 获取永久素材
    fetchMaterial (token, mediaId, type, permanent) {
        let form = {}
        let fetchUrl = api.temporary.fetch

        if (permanent) {
            fetchUrl = api.permanent.fetch
        }

        let url = fetchUrl + 'access_token=' + token
        let options = {method: "POST", url: url}

        if (permanent) {
            form.media_id = mediaId
            form.access_token = token
            options.body = form
        } else {
            if (type === 'video') {
                url = url.replace('https://', 'http://')
            }
            url += '&media_id' + mediaId
        }
        return options
    }

    // 删除永久素材
    deleteMaterial (token, mediaId) {
        const form = {media_id: mediaId}
        const url = api.permanent.del + 'access_token=' + token + '&media_id=' + mediaId
        
        return {method: 'POST', url: url, body: form}
    }

    // 修改永久图文素材
    updateMaterial (token, mediaId, news) {
        const form = {media_id: mediaId}

        _.extend(form, news)
        const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

        return {method: 'POST', url: url, body: form}
    }

    // 获取素材总数
    countMaterial (token) {
        const url = api.permanent.count + 'access_token=' + token

        return {method: 'GET', url: url}
    }

    // 获取素材列表
    batchMaterial (token, options) {
        options.type = options.type || 'iamge'
        options.offset = options.offset || 0
        options.count = options.count || 10
    }
}