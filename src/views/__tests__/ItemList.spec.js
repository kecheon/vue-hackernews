import { shallow, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import ItemList from '../ItemList.vue'
import Item from '../../components/Item.vue'
import merge from 'lodash.merge'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore (overrides) {
  const defaultStoreConfig = {
    state: {
      itemsPerPage: 25,
      items: []
    },
    getters: {
      activeItems: jest.fn()
    },
    actions: {
      fetchListData: jest.fn(() => Promise.resolve())
    }
  }
  return new Vuex.Store(
    merge(defaultStoreConfig, overrides)
  )
}
const defaultMountingOptions = {
  mocks: {
    $bar: {
      start: jest.fn(),
      finish: jest.fn()
    },
    $route: {
      params: jest.fn()
    },
    $router: { // #A
      replace: jest.fn()
    }
  },
  localVue,
  store: createStore(),
  propsData: {
    type: 'top'
  },
  stubs: {
    RouterLink: RouterLinkStub
  }
}

function createWrapper (overrides) {
  return shallow(ItemList, merge(defaultMountingOptions, overrides))
}

describe('ItemList.vue', () => {
  test('renders an Item for each item in activeItems getter', async () => {
    const items = [{}, {}, {}]
    const store = createStore({ state: { items } })
    const wrapper = createWrapper({ store })
    await flushPromises()
    expect(wrapper.findAll(Item).length).toBe(items.length)
  })

  test('passes an item object to each Item component', async () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const store = createStore({ state: { items } })
    const wrapper = createWrapper({ store })
    await flushPromises()
    const Items = wrapper.findAll(Item)
    Items.wrappers.forEach((wrapper, i) => {
      expect(wrapper.vm.item.id).toBe(items[i].id)
    })
  })

  test('calls $bar start on load', () => {
    const mocks = {
      $bar: {
        start: jest.fn()
      }
    }
    createWrapper({ mocks })
    expect(mocks.$bar.start).toHaveBeenCalled() // #E
  })

  test('calls $bar finish when load successful', async () => {
    const mocks = {
      $bar: {
        finish: jest.fn()
      }
    }
    createWrapper({ mocks })
    await flushPromises()
    expect(mocks.$bar.finish).toHaveBeenCalled()
  })

  test('renders 1/5 when on page 1 of 5', () => {
    const store = createStore({
      state: {
        lists: {
          top: new Array(100).fill({})
        }
      }
    })
    const wrapper = createWrapper({store})
    expect(wrapper.text()).toContain('1/5') // #C
  })

  test('renders 2/5 when on page 2 of 5', () => {
    const store = createStore({
      state: {
        lists: {
          top: new Array(100).fill({})
        }
      }
    })
    const mocks = {
      $route: {
        params: {
          page: 2
        }
      }
    }
    const wrapper = createWrapper({ mocks, store })
    expect(wrapper.text()).toContain('2/5')
  })

  test('calls $router.replace when the page parameter is less than 0', async () => {
    const mocks = {
      $route: {
        params: {
          page: -1
        }
      },
      $router: {
        replace: jest.fn()
      }
    }
    createWrapper({ mocks })
    await flushPromises()

    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1') // #D
  })

  test('calls $router.replace when the page parameter is greater than the max page number', async () => {
    const mocks = {
      $route: {
        params: {
          page: 1000
        }
      },
      $router: {
        replace: jest.fn()
      }
    }
    createWrapper({ mocks })

    await flushPromises()

    expect(mocks.$router.replace).toHaveBeenCalledWith('/top/1')
  })

  test('renders an a tag with an href if there are no previous pages', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('a').attributes().href).toBe(undefined) // #A
    expect(wrapper.find('a').text()).toBe('< prev') // #B
  })

  test('renders a <router-link> with the previous page if one exists', () => {
    const mocks = {
      $route: {
        params: { page: 2}
      }
    }
    const wrapper = createWrapper({ mocks })

    expect(wrapper.find(RouterLinkStub).props().to).toBe('/top/1') // #H
    expect(wrapper.find(RouterLinkStub).text()).toBe('< prev') // #I
  })

  test('renders an a tag with an href if there are no next pages', () => {
    const store = createStore({ state: {
      lists: {
        top: [{}]
      }
    }})
    const wrapper = createWrapper({ store })

    expect(wrapper.findAll('a').at(1).attributes().href).toBe(undefined)
    expect(wrapper.findAll('a').at(1).text()).toBe('more >')
  })

  test('renders a <router-link> with the next page if one exists', () => {
    const wrapper = createWrapper()
    expect(wrapper.find(RouterLinkStub).props().to).toBe('/top/2')
    expect(wrapper.find(RouterLinkStub).text()).toBe('more >')
  })

  test.only('reloads items when params.page changes', async () => {
    const mocks = {
      ...defaultMountingOptions.mocks,
      $route: {
        params: {
          page: 1
        }
      }
    }
    const actions = {
      fetchListData: jest.fn()
    }
    const store = createStore({ actions })
    const wrapper = shallow(ItemList, {
      ...defaultMountingOptions,
      mocks,
      store
    })
    await flushPromises()
    expect(actions.fetchListData).toHaveBeenCalled() // #B
    actions.fetchListData.mockReset() // #C
    mocks.$route.params.page = 2 // #D
    wrapper.update() // #E
    await flushPromises() // #F
    await flushPromises() // #F
    expect(actions.fetchListData).toHaveBeenCalled() // #G
  })
})
