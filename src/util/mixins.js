function getTitle (vm) {
  const { title } = vm.$options // #A
  if (title) {
    return typeof title === 'function' // #B
      ? title.call(vm)
      : title
  }
}

export const titleMixin = { // #C
  mounted () { // #D
    const title = getTitle(this) // #E
    if (title) {
      document.title = `Vue HN | ${title}` // #E
    }
  }
}
