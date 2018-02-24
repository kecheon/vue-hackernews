jest.mock('../../api/api')

import Vuex from 'vuex'
import Router from 'vue-router'
import { createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { sync } from 'vuex-router-sync'
import storeConfig from '../store-config'
import routerConfig from '../../router/router-config'
import {
  fetchItems,
  fetchIdsByType,
  fetchUser
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
    const ids = createIds()
    const items = createItems()
    const localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(Router)
    const store = new Vuex.Store(storeConfig)
    const router = new Router(routerConfig)
    sync(store, router)
    const type = 'top'
    fetchIdsByType.mockImplementation((calledType) => {
      return calledType === type ? Promise.resolve(ids) : Promise.resolve()
    })
    fetchItems.mockImplementation((calledIds) => {
      return arraysEqual(calledIds, ids) ? Promise.resolve(items) : Promise.resolve()
    })
    store.dispatch('fetchListData', { type })

    await flushPromises()

    expect(store.getters.activeItems).toHaveLength(20)
    expect(store.getters.activeItems.every((item, i) => item === items[i])).toBe(true)
  })

  test('calling fetchUser with an id sets the return from fetchUser as store.user', async () => {
    const user = {
      id: 'a123',
      name: 'Edd'
    }
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const store = new Vuex.Store(storeConfig)
    fetchUser.mockImplementation((id) => {
      return id === user.id ? Promise.resolve(user) : Promise.resolve()
    })
    store.dispatch('fetchUser', { id: user.id })

    await flushPromises()

    expect(store.state.users[user.id]).toBe(user)
  })
})
