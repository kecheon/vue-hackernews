import mutations from '../mutations'

describe('mutations', () => {
  test('setActiveType sets state to type', () => {
    const type = 'top'
    const state = {}
    mutations.setActiveType(state, { type })
    expect(state.activeType).toBe(type)
  })

  test('setIds sets state.ids to ids', () => {
    const ids = [1, 2, 3]
    const state = {
      ids: []
    }
    mutations.setIds(state, { ids })
    expect(state.ids).toBe(ids)
  })

  test('setItems sets state.items to items', () => {
    const items = [{id: 1}, {id: 2}]
    const state = {
      items: []
    }
    mutations.setItems(state, { items })
    expect(state.items).toBe(items)
  })
})
