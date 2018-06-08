import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rapapi.org/mockjsdata/34647'

class Services {
  getWechatSignature(url) {
    return axios.get(`${baseUrl}/wx-signature?url=${url}`)
  }

  getUserByOAuth(url) {
    return axios.get(`${baseUrl}/wx-oauth?url=${url}`)
  }

  fetchHouses() {
    return axios.get(`${apiUrl}/wiki/houses`)
  }

  fetchCharacters() {
    return axios.get(`${apiUrl}/wiki/characters`)
  }

  fetchCities() {
    return axios.get(`${apiUrl}/wiki/cities`)
  }
}

export default new Services()
