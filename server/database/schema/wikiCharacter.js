const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const WikiCharacterSchema = new mongoose.Schema({
  _id: String,
  wikiId: Number,
  nmId: String,
  chId: String,
  name: String,
  cname: String,
  playedBy: String,
  profile: String,
  images: [String],
  sections: Mixed,
  intro: [String],
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
WikiCharacterSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

const WikiCharacter = mongoose.model('WikiCharacter', WikiCharacterSchema)
