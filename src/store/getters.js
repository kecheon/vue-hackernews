export default {
  activeIds (state) {
    const { ids } = state
    return ids.slice(0, 20)
  }
}
