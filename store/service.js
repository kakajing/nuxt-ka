import axios from 'axios'

const baseUrl = ''
// const apiUrl = 'http://rapapi.org/mockjsdata/34647'

class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wx-signature?url=${url}`)
  }

  getUserByOAuth(url) {
    return axios.get(`${baseUrl}/wx-oauth?url=${url}`)
  }

  getWechOAuth(url) {
    return axios.get(`${baseUrl}/wx-oauth?url=${encodeURIComponent(url)}`)
  }

  createOrder({ productId, name, address, phoneNumber }) {
    return axios.post(`${baseUrl}/wechat-pay`, {
      productId,
      name,
      address,
      phoneNumber
    })
  }

  fetchHouses() {
    return axios.get(`${baseUrl}/wiki/houses`)
  }

  fetchCharacters() {
    return axios.get(`${baseUrl}/wiki/characters`)
    // return {data: {data: []}, success: true}
  }

  // fetchCities() {
  //   // return axios.get(`${baseUrl}/wiki/cities`)
  //   return {data: {data: []}, success: true}
  // }

  fetchHouse(id) {
    return axios.get(`${baseUrl}/wiki/houses/${id}`)
  }

  fetchCharacter(id) {
    return axios.get(`${baseUrl}/wiki/characters/${id}`)
  }

  fetchProducts() {
    return axios.get(`${baseUrl}/api/products`)
  }

  fetchProduct(id) {
    return axios.get(`${baseUrl}/api/products/${id}`)
  }

  fetchUserAndOrders() {
    return axios.get(`${baseUrl}/api/user`)
  }
}

export default new Services()
