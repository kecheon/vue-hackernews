import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import UserView from '../UserView.vue'

describe('UserView.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let actions
  let getters
  let store
  let state
  let mocks

  beforeEach(() => {
    actions = {
      fetchUser: jest.fn(() => Promise.resolve())
    }
    state = {
      users: {
        'user1': {
          id: 'user1'
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

  test('renders "User not found" if user does not exist in store', () => {
    state.users.notFound = false
    mocks.$route.params.id = 'notFound'
    const wrapper = shallow(UserView, {
      localVue,
      mocks,
      store
    })

    expect(wrapper.text()).toContain('User not found')
  })

  test('does not render "User not found" if user exists in store', () => {
    mocks.$route.params.id = 'user1'
    const wrapper = shallow(UserView, {
      localVue,
      mocks,
      store
    })
    expect(wrapper.text()).not.toContain('User not found')
  })

  test('generates link to users submissions and threads using users id', () => {
    mocks.$route.params.id = 'user1'
    const wrapper = shallow(UserView, {
      localVue,
      mocks,
      store
    })
    const aWrappers = wrapper.findAll('a')
    expect(aWrappers.at(0).element.href).toBe('https://news.ycombinator.com/submitted?id=user1')
    expect(aWrappers.at(1).element.href).toBe('https://news.ycombinator.com/threads?id=user1')
  })

  test('renders user.about as html if it exists', () => {
    state.users.user1.about = '<p>some html</p>'
    mocks.$route.params.id = 'user1'
    const wrapper = shallow(UserView, {
      localVue,
      mocks,
      store
    })
    expect(wrapper.html()).toContain(state.users.user1.about)
  })

  test('sets the title to user id', () => {
    mocks.$route.params.id = 'user1'
    shallow(UserView, {
      localVue,
      mocks,
      store
    })
    expect(document.title).toBe('Vue HN | user1')
  })

  test('sets the title to "User not found" if user is not found', () => {
    state.users.notFound = false
    mocks.$route.params.id = 'notFound'
    shallow(UserView, {
      localVue,
      mocks,
      store
    })
    expect(document.title).toBe('Vue HN | User not found')
  })

  test('dispatches fetchUser with route id parameter before component is created', () => {
    jest.spyOn(store, 'dispatch')
    mocks.$route.params.id = 'someId'
    shallow(UserView, {
      localVue,
      mocks,
      store
    })
    expect(store.dispatch).toHaveBeenCalledWith('fetchUser', {id: 'someId'})
  })

  test('renders user.about as html if it exists', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    state.users.user1 = {
      about: 'Software engineer living in London',
      created: (dateNowTime / 1000) - 6000000,
      id: 'user1',
      karma: 87870
    }
    mocks.$route.params.id = 'user1'
    const wrapper = shallow(UserView, {
      localVue,
      mocks,
      store
    })
    dateNow.mockRestore()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
