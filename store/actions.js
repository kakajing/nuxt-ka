import Services from './service'

export default {
  // 签名
  getWechatSignature({ commit }, url) {
    return Services.getWechatSignature(url)
  }
}