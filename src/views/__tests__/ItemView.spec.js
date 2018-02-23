import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ItemView from '../ItemView.vue'
import Comment from '../../components/Comment.vue'
import Spinner from '../../components/Spinner.vue'
import flushPromises from 'flush-promises'

describe('ItemView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let actions
  let getters
  let store
  let state
  let mocks

  beforeEach(() => {
    actions = {
      fetchItems: jest.fn(() => Promise.resolve())
    }
    state = {
      items: {
        'id1': {
          kids: ['comment1', 'comment2', 'comment3']
        }
      }
    }
    store = new Vuex.Store({
      state,
      getters,
      actions
    })
    mocks = {
      $route: {
        params: {}
      }
    }
  })

  test('renders a comment for each item in the item kids array', async () => {
    mocks.$route.params.id = 'id1'
    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    await flushPromises()
    const comments = wrapper.findAll(Comment)
    expect(comments.length).toBe(3)
    comments.wrappers.forEach((comment, i) => {
      comment.props().id === state.items.id1[i]
    })
    expect(wrapper.findAll(Comment).length).toBe(3)
  })

  test('renders a comment for each item in the item kids array', async () => {
    mocks.$route.params.id = 'id1'
    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    await flushPromises()

    expect(wrapper.findAll(Comment).length).toBe(3)
  })

  test('renders a spinner and no comments if item has kids but the store does not have the items', () => {
    mocks.$route.params.id = 'id1'
    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    expect(wrapper.findAll(Spinner)).toHaveLength(1)
    expect(wrapper.findAll(Comment)).toHaveLength(0)
  })

  test('renders no spinner and "No comments yet" if the item has no kids', async () => {
    state.items.id1.kids = null
    mocks.$route.params.id = 'id1'
    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })

    expect(wrapper.findAll(Spinner)).toHaveLength(0)
    expect(wrapper.text()).toContain('No comments yet')
  })

  test('renders the hostname if item contains a URL', () => {
    state.items.id1.url = 'https://google.com/some-path'
    mocks.$route.params.id = 'id1'
    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    expect(wrapper.text()).toContain('(google.com)')
  })

  test('renders the human readable time using item Unix time', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    state.items.id1.time = (dateNowTime / 1000) - 600
    mocks.$route.params.id = 'id1'

    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    expect(wrapper.text()).toContain('10 minutes ago')
    dateNow.mockRestore()
  })

  test('does not dispatch fetchItems if item exists', () => {
    jest.spyOn(store, 'dispatch')
    mocks.$route.params.id = 'id1'
    shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    expect(store.dispatch).not.toHaveBeenCalledWith('fetchItems', {ids: ['id2']})
  })

  test('dispatches fetchItems with the id param on mount when no item exists in store', () => {
    jest.spyOn(store, 'dispatch')
    mocks.$route.params.id = 'id2'
    shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    expect(store.dispatch).toHaveBeenCalledWith('fetchItems', {ids: ['id2']})
  })

  test('dispatches fetchItems with the kids ids when item has kids', () => {
    jest.spyOn(store, 'dispatch')
    mocks.$route.params.id = 'id1'
    shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    expect(store.dispatch).toHaveBeenCalledWith('fetchItems', {ids: state.items.id1.kids})
  })

  test('dispatches fetchItems for nested kids ids when item has kids', () => {})

  test('stops displaying spinner when fetchItems resolves for comments', async () => {
    jest.spyOn(store, 'dispatch')
    const commentKids = [1, 2, 3]
    state.items.comment1 = {
      kids: commentKids
    }
    state.items.comment2 = {}
    mocks.$route.params.id = 'id1'
    shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    await flushPromises()
    expect(store.dispatch).toHaveBeenCalledWith('fetchItems', {ids: commentKids})
  })

  test('renders correctly', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    state.items.id1 = {
      by: 'eddyerburgh',
      descendants: 3,
      id: 'id1',
      kids: [1, 2, 3],
      score: 49,
      time: (dateNowTime / 1000) - 600,
      title: 'vue-test-utils',
      type: 'story',
      url: 'vue-test-utils.vuejs.org'
    }
    mocks.$route.params.id = 'id1'
    const wrapper = shallow(ItemView, {
      localVue,
      mocks,
      store
    })
    dateNow.mockRestore()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
