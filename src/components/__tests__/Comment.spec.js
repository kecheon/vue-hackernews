import { shallow, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import merge from 'lodash.merge'
import Comment from '../Comment.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore (overrides) {
  const defaultStoreConfig = {
    state: {
      comments: {
        a1: {
          kids: []
        }
      }
    }
  }
  return new Vuex.Store(
    merge(defaultStoreConfig, overrides)
  )
}

function createWrapper (overrides) {
  const defaultMountingOptions = {
    store: createStore(),
    propsData: {
      id: 'a1'
    },
    localVue,
    stubs: {
      'router-link': RouterLinkStub
    }
  }
  return shallow(Comment, merge(defaultMountingOptions, overrides))
}

describe('Comment.vue', () => {
  test('sets router-link to prop using comment.by', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            by: 'edd'
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    const expectedTo = '/user/edd'
    expect(wrapper.findAll('.by')).toHaveLength(1)
    expect(wrapper.find(RouterLinkStub).vm.to).toBe(expectedTo)
  })

  test('does not render li if comment cannot be found in store', () => {
    const wrapper = createWrapper({
      propsData: {
        id: 'a4'
      }
    })
    expect(wrapper.find('li').exists()).toBe(false)
  })

  test('renders toggle with class open if comment has kids', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            kids: [{}, {}]
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('.toggle').classes()).toContain('open')
  })

  test('does not render toggle if comment has no kids', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            kids: []
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('.toggle').exists()).toEqual(false)
  })

  test.skip('toggles class open when a tag is clicked', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            kids: [{}, {}]
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('.toggle').classes()).toContain('open')
    wrapper.find('a').trigger('click')
    expect(wrapper.find('.toggle').classes()).not.toContain('open')
  })

  test.skip('toggles <a> tag text when <a> tag is clicked', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            kids: [{}, {}]
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('a').text()).toContain('[-]')
    wrapper.find('a').trigger('click')
    expect(wrapper.find('a').text()).toContain('[+] 2 replies collapsed')
  })

  test.skip('does not collapsed text when only 1 kid', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            kids: [{}]
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    const closedText = `[+] 1 reply collapsed`
    wrapper.find('a').trigger('click')
    expect(wrapper.find('a').text()).toContain(closedText)
  })

  test('renders a comment for each kid', () => {
    const store = createStore({
      state: {
        comments: {
          a1: {
            kids: [{}, {}]
          }
        }
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.findAll(Comment)).toHaveLength(2)
  })
})
