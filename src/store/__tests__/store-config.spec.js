jest.mock('../../api/api') // #A

import Vuex from 'vuex'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import storeConfig from '../store-config'
import { fetchListData } from '../../api/api'
import deepClone from 'lodash.clonedeep'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import routerConfig from '../../router/router-config'
import { createLocalVue } from '@vue/test-utils'

function createItems () { // #B
  const arr = new Array(22)
  return arr.fill().map((item, i) => ({id: `a${i}`, name: 'item'}))
}
const localVue = createLocalVue()

localVue.use(Vuex) // #A
localVue.use(Router) // #B
const store = new Vuex.Store(storeConfig)
const router = new Router(routerConfig) // #C
sync(store, router) // #D

describe('store-config', () => {
  test('calling fetchListData with the type returns top 20 activeItems from activeItems getter', async () => {
    const items = createItems() // #C
    Vue.use(Vuex) // #D
    const clonedStoreConfig = deepClone(storeConfig)
    const store = new Vuex.Store(clonedStoreConfig) // #E
    const type = 'top'
    fetchListData.mockImplementation((calledType) => { // #F
      return calledType === type
        ? Promise.resolve(items)
        : Promise.resolve()
    })
    store.dispatch('fetchListData', { type }) // #H

    await flushPromises()

    expect(store.getters.displayItems).toHaveLength(20)
    expect(store.getters.displayItems.every((item, i) => item === items[i])).toBe(true)// #I
  })
})
