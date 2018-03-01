jest.mock('../../api/api.js')
jest.useRealTimers()

import { mount, createLocalVue } from 'vue-test-utils'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

function createMountOptions(overrides) {
  return {
    mocks: {
      $bar: {
        start: jest.fn(),
        finish: jest.fn()
      }
    },
    localVue,
    store: new Vuex.Store({
      state: {},
      getters: {
        activeItems: jest.fn()
      },
      actions: {
        fetchListData: jest.fn(() => Promise.resolve())
      }
    })
  }
}

describe('ItemList.vue', () => {
  test('renders an Item for each item in state.items', async () => {
    const items = [{}, {}, {}]
    const mountingOptions = createMountOptions()
    mountingOptions.store.state.items = items

    const wrapper = mount(ItemList, mountingOptions)
    await flushPromises()
    expect(wrapper.findAll(Item).length).toBe(items.length)
  })

  test('passes an item object to each Item component', () => {
    const items = [{}, {}, {}]
    const mountingOptions = createMountOptions()
    mountingOptions.store.state.items = items

    const wrapper = mount(ItemList, mountingOptions)
    const Items = wrapper.findAll(Item)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.vm.item).toBe(items[i])
    })
  })

  test('calls $bar start on load', () => {
    const mountingOptions = createMountOptions()
    mount(ItemList, mountingOptions)
    expect(mountingOptions.mocks.$bar.start).toHaveBeenCalled()
  })

  test('calls $bar finish when load succesful', async () => {
    const mountingOptions = createMountOptions()
    mount(ItemList, mountingOptions)
    await flushPromises()
    expect(mountingOptions.mocks.$bar.finish).toHaveBeenCalled()
  })
})
