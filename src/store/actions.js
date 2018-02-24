import { fetchItems, fetchIdsByType } from '../api/api'

export default {
  fetchListData: ({ commit, state, getters }, { type }) => {
    commit('setActiveType', { type })
    return fetchIdsByType(type)
      .then(ids => commit('setIds', { ids }))
      .then(() => fetchItems(getters.activeIds))
      .then(items => commit('setItems', { items }))
  }
}
