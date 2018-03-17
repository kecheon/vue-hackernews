import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  activeType: null,
  items: [],
  ids: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
