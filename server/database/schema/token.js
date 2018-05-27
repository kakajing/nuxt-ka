const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new mongoose.Schema({
  name: String,
  access_token: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 保存每条数据之前先经过中间件的处理，判断是否是新增数据
TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

TokenSchema.statics = {
 // 获取token
  async getAccessToken () {
    const token = await this.findOne({ name: 'access_token' }).exec()
    if (token && token.token) {
        token.access_token = token.token
    }
    return token
  },

  // 保存token
  async saveAccessToken (data) {
    let token = await this.findOne({ name: 'access_token' }).exec()
    if (token) {
      token.access_token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        expires_in: data.expires_in,
        access_token: data.access_token
      })
    }
  
    await token.save()
    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
