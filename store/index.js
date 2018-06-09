import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const createStore = () => {
  return new Vuex.Store({
    state: {
      houses: [],
      characters: [],
      cities: [],
      currentHouse: {}
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
