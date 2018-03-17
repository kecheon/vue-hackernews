import { fetchListData } from '../api/api'

export default {
  fetchListData: ({ commit, state, getters }, { type }) => {
    return fetchListData(type)
      .then(items => commit('setItems', { items }))
  }
}
