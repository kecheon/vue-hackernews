jest.mock('../../api/api.js')
jest.useRealTimers()

import { shallow, createLocalVue } from '@vue/test-utils'
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
  let state
  let mocks
  let items

  beforeEach(() => {
    actions = {
      fetchListData: jest.fn(() => Promise.resolve())
    }
    getters = {
      activeItems: jest.fn()
    }
    items = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    state = {
      itemsPerPage: 25, lists: {top: items}
    }
    store = new Vuex.Store({
      state,
      getters,
      actions
    })
    mocks = {
      $bar: {
        start: jest.fn(),
        finish: jest.fn()
      },
      $route: {
        params: {}
      },
      $router: {
        replace: jest.fn()
      }
    }
  })

  test('renders an Item for each item in activeItems getter', async () => {
    const items = [{}, {}, {}]
    getters.activeItems.mockImplementation(() => items)

    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    await flushPromises()

    expect(wrapper.findAll(Item).length).toBe(items.length)
  })

  test('passes an item object to each Item component', () => {
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    const Items = wrapper.findAll(Item)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.vm.item).toBe(items[i])
    })
  })

  test('renders 1/5 when on page 1 of 5', () => {
    state.lists.top = new Array(100).fill({})
    mocks.$route = {
      params: {
      }
    }
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    expect(wrapper.text()).toContain('1/5')
  })

  test('renders 2/5 when on page 2 of 5', () => {
    state.lists.top = new Array(100).fill({})
    mocks.$route.params.page = 2

    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    expect(wrapper.text()).toContain('2/5')
  })

  test('calls $bar start on load', () => {
    shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    expect(mocks.$bar.start).toHaveBeenCalled()
  })

  test('calls $bar finish when load succesful', async () => {
    shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })

    await flushPromises()

    expect(mocks.$bar.finish).toHaveBeenCalled()
  })

  test('calls $router.replace when the page parameter is less than 0', async () => {
    mocks.$route.params.page = -1
    shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })

    await flushPromises()

    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
  })

  test('calls $router.replace when the page parameter is greater than the max page number', async () => {
    mocks.$route.params.page = 1000
    shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })

    await flushPromises()

    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
  })

  test('renders an a tag with an href if there are no previous pages', () => {
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })

    expect(wrapper.find('a').attributes().href).toBe(undefined)
    expect(wrapper.find('a').text()).toBe('< prev')
  })

  test('renders a <router-link> with the previous page if one exists', () => {
    const RouterLink = {
      name: 'router-link',
      render: function (h) {
        return h('div', this.$slots.default)
      },
      props: ['to']
    }
    mocks.$route.params.page = 2
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      stubs: {
        RouterLink
      },
      propsData: {type: 'top'}
    })

    expect(wrapper.find(RouterLink).props().to).toBe('/top/1')
    expect(wrapper.find(RouterLink).text()).toBe('< prev')
  })

  test('renders an a tag with an href if there are no next pages', () => {
    state.lists.top = [{}]
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })

    expect(wrapper.findAll('a').at(1).attributes().href).toBe(undefined)
    expect(wrapper.findAll('a').at(1).text()).toBe('more >')
  })

  test('renders a <router-link> with the next page if one exists', () => {
    const RouterLink = {
      name: 'router-link',
      render: function (h) {
        return h('div', this.$slots.default)
      },
      props: ['to']
    }
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      stubs: {
        RouterLink
      },
      propsData: {type: 'top'}
    })

    expect(wrapper.find(RouterLink).props().to).toBe('/top/2')
    expect(wrapper.find(RouterLink).text()).toBe('more >')
  })

  test('reloads items when params.page changes', async () => {
    mocks.$route.params.page = 1
    const wrapper = shallow(ItemList, {
      mocks,
      propsData: {
        type: 'top'
      },
      store,
      localVue
    })
    await flushPromises()

    expect(actions.fetchListData).toHaveBeenCalled()
    actions.fetchListData.mockReset()
    mocks.$route.params.page = 2
    wrapper.update()
    await flushPromises()
    expect(actions.fetchListData).toHaveBeenCalled()
  })

  test('sets document.title with the capitalized type prop', () => {
    shallow(ItemList, {
      mocks,
      propsData: {
        type: 'top'
      },
      store,
      localVue
    })
    expect(document.title).toBe('Vue HN | Top')
  })

  test('renders correctly', async () => {
    getters.activeItems.mockImplementation(() => items)
    const wrapper = shallow(ItemList, {
      mocks,
      propsData: {
        type: 'top'
      },
      store,
      localVue
    })
    await flushPromises()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
