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

  async showHouse({ state }, id) {
    if (id === state.currentHouse._id) return
    const res = await Services.fetchHouse(id)
    state.currentHouse = res.data.data

    return res
  }
}
