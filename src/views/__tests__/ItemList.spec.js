jest.mock('../../api/api.js')
jest.useRealTimers()

import { mount, createLocalVue } from 'vue-test-utils'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'

describe('ItemList.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let actions
  let getters
  let store

  beforeEach(() => {
    actions = {
      fetchListData: jest.fn(() => Promise.resolve())
    }
    getters = {
      activeItems: jest.fn()
    }
    store = new Vuex.Store({
      state: {},
      getters,
      actions
    })
  })

  test('renders an Item for each item in state.items', async () => {
    const $bar = {
      start: () => {},
      finish: () => {}
    }
    const items = [{}, {}, {}]
    store.state.items = items

    const wrapper = mount(ItemList, {mocks: {$bar}, localVue, store})
    await flushPromises()
    expect(wrapper.findAll(Item).length).toBe(items.length)
  })

  test('passes an item object to each Item component', () => {
    const $bar = {
      start: () => {},
      finish: () => {}
    }
    const wrapper = mount(ItemList, {mocks: {$bar}, localVue, store})
    const Items = wrapper.findAll(Item)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.vm.item).toBe(window.items[i])
    })
  })

  test('calls $bar start on load', () => {
    const $bar = {
      start: jest.fn(),
      finish: () => {}
    }
    mount(ItemList, {mocks: {$bar}, localVue, store})
    expect($bar.start).toHaveBeenCalled()
  })

  test('calls $bar finish when load succesful', async () => {
    const $bar = {
      start: () => {},
      finish: jest.fn()
    }
    mount(ItemList, {mocks: {$bar}, localVue, store})
    await flushPromises()
    expect($bar.finish).toHaveBeenCalled()
  })
})
