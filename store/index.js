import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const createStore = () => {
  return new Vuex.Store({
    state: {
      imageCDN: 'http://omux103p0.bkt.clouddn.com/',
      imageCDN2: 'http://oxkc6g4t4.bkt.clouddn.com/',
      houses: [],
      characters: [],
      currentHouse: {},
      currentCharacter: {},
      products: [],
      currentProduct: [],
      user: null,
      authUser: null,
      payments: []
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
