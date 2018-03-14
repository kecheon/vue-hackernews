import { fetchItems, fetchIdsByType, fetchListData } from '../api/api'

export default {
  fetchItem: ({ commit, getters }, { id }) => {
    return fetchItems([id])
      .then(items => commit('setItem', { item }))
  },

  fetchItems: ({ commit, getters }, { ids }) => {
    console.log(ids)
    return fetchItems(ids)
      .then(items => commit('setItems', { items }))
  },

  fetchListData: ({ commit, getters, dispatch }, { type }) => {
    commit('setActiveType', { type })
    return fetchListData(type)
      .then(items => commit('setItems', { items }))
  }

}
