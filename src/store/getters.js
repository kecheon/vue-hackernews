export default {
  displayItems (state) {
    const page = Number(state.route.params.page) || 1
    const start = (page - 1) * 20 // #B
    const end = page * 20 // #C
    return state.items.slice(start, end)
  }
}
