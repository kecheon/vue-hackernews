export default {
  setActiveType: (state, { type }) => {
    state.activeType = type
  },

  setIds: (state, { ids }) => {
    state.ids = ids
  },

  setItems: (state, { items }) => {
    state.items = items
  }
}
