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
    return axios.get(`${baseUrl}/wiki/products`)
  }

  fetchProduct(id) {
    return axios.get(`${baseUrl}/wiki/products/${id}`)
  }

  fetchUserAndOrders() {
    return axios.get(`${baseUrl}/api/user`)
  }
}

export default new Services()
