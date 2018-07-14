import fs from 'fs'
import config from '../config'
import wechatPay from 'wechat-pay'
import path from 'path'

const cert = path.resolve(__dirname, '../', 'config/cert/apiclient_cert.p12')

const paymentConfig = {
  appId: config.shop.appId,
  partnerKey: config.shop.partnerKey,
  mchId: config.shop.mchId,
  notifyUrl: config.shop.notifyUrl,   // 通知地址
  ptx: fs.readFileSync(cert)     // 证书
}
const Payment = wechatPay.Payment
const payment = new Payment(paymentConfig || {})

// 获取预支付订单
export const getParamsAsync  = (order) => {
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, (err, payargs) => {
      if (err) reject(err)
      else resolve(payargs)
    })
  })
}

// 获取订单数据
export const getPayDataAsync = (req) => {
  return new Promise((resolve, reject) => {
    let data = ''

    req.setEncoding('utf8')
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      req.rawBody = data

      resolve(data)
    })
  })
}

// 订单微信推送通知
export const getNoticeAsync = (rawBody) => {
  return new Promise((resolve, reject) => {
    payment.validate(rawBody, (err, message) => {
      if (err) reject(err)
      else resolve(message)
    })
  })
}

// 获取所有订单列表
export const getBillAsync = (date) => {
  return new Promise((resolve, reject) => {
    payment.downloadBill({
      bill_date: date,
      bill_type: 'ALL'
    }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

// 获取订单
export const getOrdersAsync = (params) => {
  return new Promise((resolve, reject) => {
    payment.orderQuery(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

// 失败信息
export const buildFailXML = (err) => {
  return payment.buildXml({
    return_code: 'FAIL',
    return_msg: err.name
  })
}

// 成功信息
export const buildSuccessXML = (err) => {
  if (err) return buildFailXML(err)

  return payment.buildXml({
    return_code: 'SUCCESS'
  })
}