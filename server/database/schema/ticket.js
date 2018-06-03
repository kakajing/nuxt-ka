const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: String,
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
TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

TicketSchema.statics = {
 // 获取ticket
  async getTicket () {
    const ticket = await this.findOne({ name: 'ticket' }).exec()
    if (ticket && ticket.ticket) {
        ticket.ticket = ticket.ticket
    }
    return ticket
  },

  // 保存ticket
  async saveTicket (data) {
    let ticket = await this.findOne({ name: 'ticket' }).exec()
    if (ticket) {
      ticket.ticket = data.ticket
      ticket.expires_in = data.expires_in
    } else {
      ticket = new Ticket({
        name: 'ticket',
        expires_in: data.expires_in,
        ticket: data.ticket
      })
    }
  
    await ticket.save()
    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
