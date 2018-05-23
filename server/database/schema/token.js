const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new mongoose.Schema({
    name: String,
    access_token: String,
    expires_in: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        upatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

// 保存每条数据之前先经过中间件的处理，判断是否是新增数据
TokenSchema.pre('save', (next) => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.upatedAt = Date.now()
    } else {
        this.meta.upatedAt = Date.now()
    }
    next()
})

TokenSchema.static = {
    // 获取token
    async getAccessToken () {
        const token = await this.findOne({name: 'access_token'}).exec()

        return token
    },

    // 保存token
    async saveAccessToken (data) {
        let token = await this.findOne({name: 'access_token'}).exec()
        if (token) {
            token.token = data.access_token
            token.expires_in = data.expires_in
        } else {
            token = new token({
                name: 'access_token',
                token: data.access_token,
                expires_in: data.expires_in
            })
        }
        
        await token.save()
        return data
    }
}

const Token = mongoose.model('Token', TokenSchema)