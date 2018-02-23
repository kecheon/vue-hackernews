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
  let state // #A
  let mocks
  let items

  beforeEach(() => {
    actions = {
      fetchListData: jest.fn(() => Promise.resolve())
    }
    getters = {
      activeItems: jest.fn()
    }
    items = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] // #B
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
      $router: { // #A
        replace: jest.fn()
      }
    }
  })

  test('renders an Item for each item in activeItems getter', async () => {
    const items = [{}, {}, {}]
    getters.activeItems.mockImplementation(() => items)

    const wrapper = shallow(ItemList, {
      mocks, // #D
      localVue,
      store,
      propsData: {type: 'top'}
    })

    await flushPromises
    await flushPromises

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

  test('calls $bar start on load', () => {
    shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    expect(mocks.$bar.start).toHaveBeenCalled() // #E
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

  test('renders 1/5 when on page 1 of 5', () => {
    state.lists.top = new Array(100).fill({}) // #A
    mocks.$route.params = {} // #B
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    expect(wrapper.text()).toContain('1/5') // #C
  })

  test('renders 2/5 when on page 2 of 5', () => {
    state.lists.top = new Array(100).fill({})
    mocks.$route.params.page = 2 // #E

    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      propsData: {type: 'top'}
    })
    expect(wrapper.text()).toContain('2/5')
  })

  test('calls $router.replace when the page parameter is less than 0', async () => {
    mocks.$route.params.page = -1 // #B
    shallow(ItemList, {
      mocks,
      localVue, // #C
      store,
      propsData: {type: 'top'}
    })

    await flushPromises()

    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1') // #D
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

    expect(wrapper.find('a').attributes().href).toBe(undefined) // #A
    expect(wrapper.find('a').text()).toBe('< prev') // #B
  })

  test('renders a <router-link> with the previous page if one exists', () => {
    const RouterLink = { // #C
      render: function (h) {
        return h('div', this.$slots.default) // #E
      },
      name: 'router-link',
      props: ['to'] // #F
    }
    mocks.$route.params.page = 2
    const wrapper = shallow(ItemList, {
      mocks,
      localVue,
      store,
      stubs: { // #G
        RouterLink
      },
      propsData: {type: 'top'}
    })

    expect(wrapper.find(RouterLink).props().to).toBe('/top/1') // #H
    expect(wrapper.find(RouterLink).text()).toBe('< prev') // #I
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
      render: function (h) {
        return h('div', this.$slots.default)
      },
      name: 'router-link',
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
    mocks.$route.params.page = 1 // #A
    const wrapper = shallow(ItemList, {
      mocks,
      propsData: {
        type: 'top'
      },
      store,
      localVue
    })
    await flushPromises()

    expect(actions.fetchListData).toHaveBeenCalled() // #B
    actions.fetchListData.mockReset() // #C
    mocks.$route.params.page = 2 // #D
    wrapper.update() // #E
    await flushPromises() // #F
    expect(actions.fetchListData).toHaveBeenCalled() // #G
  })

  test('Sets document.title with the capitalized type prop', () => {
    shallow(ItemList, { // #A
      mocks,
      propsData: {
        type: 'top'
      },
      store,
      localVue
    })
    expect(document.title).toBe('Vue HN | Top') // #B
  })
})
