const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const WikiHouseSchema = new mongoose.Schema({
  name: String,
  cname: String,
  words: String,
  cover: String,
  sections: Mixed,
  intro: String,
  wikiId: Number,
  swornMembers: [
    {
      character: {
        type: String,
        ref: 'WikiCharacter'
      },
      text: String
    }
  ],
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
WikiHouseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

const WikiHouse = mongoose.model('WikiHouse', WikiHouseSchema)
