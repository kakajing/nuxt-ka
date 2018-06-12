import Services from './service'

export default {
  // 签名
  getWechatSignature({ commit }, url) {
    return Services.getWechatSignature(url)
  },

  getUserByOAuth({ commit }, url) {
    return Services.getUserByOAuth(url)
  },

  async fetchHouses({ state }) {
    const res = await Services.fetchHouses()
    state.houses = res.data.data

    return res
  },

  async fetchCharacters({ state }) {
    const res = await Services.fetchCharacters()
    state.characters = res.data.data

    return res
  },

  async fetchCities({ state }) {
    const res = await Services.fetchCities()
    state.cities = res.data.data

    return res
  },

  async showHouse({ state }, _id) {
    if (_id === state.currentHouse._id) return
    const res = await Services.fetchHouse(_id)
    state.currentHouse = res.data.data

    return res
  },

  async showCharacter({ state }, _id) {
    if (_id === state.currentCharacter._id) return
    const res = await Services.fetchCharacter(_id)
    state.currentCharacter = res.data.data

    return res
  },

  async fetchProducts({ state }) {
    const res = await Services.fetchProducts()
    state.products = res.data.data

    return res
  },

  async showProduct({ state }, _id) {
    if (_id === state.currentProduct._id) return
    const res = await Services.fetchProduct(_id)
    state.currentProduct = res.data.data

    return res
  }
}
