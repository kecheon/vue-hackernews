jest.mock('../../api/api') // #A

import Vuex from 'vuex'
import { createLocalVue } from 'vue-test-utils'
import flushPromises from 'flush-promises'
import storeConfig from '../store-config'
import {
  fetchItems,
  fetchIdsByType
} from '../../api/api'

function createIds () {
  const arr = new Array(22)
  return arr.fill().map((item, i) => `a${i}`)
}

function createItems () {
  const arr = new Array(22)
  return arr.fill().map((item, i) => ({id: `a${i}`, name: 'item'}))
}

function arraysEqual (arr1, arr2) {
  return arr1.every((item, i) => item === arr2[i])
}

describe('store-config', () => {
  test('calling fetchListData with the type returns top 20 activeItems from activeItems getter', async () => {
    const ids = createIds() // #B
    const items = createItems() // #C
    const localVue = createLocalVue()
    localVue.use(Vuex) // #D
    const store = new Vuex.Store(storeConfig) // #E
    const type = 'top'
    fetchIdsByType.mockImplementation((calledType) => { // #F
      return calledType === type
        ? Promise.resolve(ids)
        : Promise.resolve()
    })
    fetchItems.mockImplementation((calledIds) => { // #G
      return arraysEqual(calledIds, ids)
        ? Promise.resolve(items.slice(0, calledIds.length))
        : Promise.resolve()
    })
    store.dispatch('fetchListData', { type }) // #H

    await flushPromises()

    expect(store.state.items).toHaveLength(20)
    expect(store.state.items.every((item, i) => item === items[i])).toBe(true)// #I
  })
})
