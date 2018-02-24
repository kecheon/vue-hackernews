import { shallow, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Comment from '../Comment.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

const RouterLink = {
  render: () => {},
  name: 'RouterLink',
  props: ['to']
}

const a1 = {
  kids: []
}

const store = new Vuex.Store({
  state: {
    items: {a1}
  }
})

describe('Comment.vue', () => {
  test('sets router-link to prop using comment.by', () => {
    a1.by = 'edd'
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      },
      stubs: {
        'router-link': RouterLink
      }
    })
    const expectedTo = `/user/${a1.by}`
    expect(wrapper.findAll('.by')).toHaveLength(1)
    expect(wrapper.find(RouterLink).vm.to).toBe(expectedTo)
  })

  test('does not render li if comment cannot be found in store', () => {
    const wrapper = shallow(Comment, {
      localVue,
      store
    })
    expect(wrapper.find('li').exists()).toBe(false)
  })

  test('renders toggle with class open if comment has kids', () => {
    a1.kids = ['', '']
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    expect(wrapper.find('.toggle').element.classList).toContain('open')
  })

  test('does not render toggle if comment has no kids', () => {
    a1.kids = []
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    expect(wrapper.find('.toggle').exists()).toEqual(false)
  })

  test('toggles class open when a tag is clicked', () => {
    a1.kids = ['', '']
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    expect(wrapper.find('.toggle').element.classList).toContain('open')
    wrapper.find('a').trigger('click')
    expect(wrapper.find('.toggle').element.classList).not.toContain('open')
  })

  test('toggles a tag text when a tag is clicked', () => {
    a1.kids = ['', '']
    const closedText = `[+] ${a1.kids.length} replies collapsed`
    const openText = '[-]'
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    expect(wrapper.find('a').text()).toContain(openText)
    wrapper.find('a').trigger('click')
    expect(wrapper.find('a').text()).toContain(closedText)
  })

  test('pluralizes collapsed text when only 1 kid', () => {
    a1.kids = ['']
    const closedText = `[+] ${a1.kids.length} reply collapsed`
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    wrapper.find('a').trigger('click')
    expect(wrapper.find('a').text()).toContain(closedText)
  })

  test('renders a comment for each kid', () => {
    a1.kids = ['', '']
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    expect(wrapper.findAll(Comment)).toHaveLength(a1.kids.length)
  })

  test('renders a comment for each kid', () => {
    a1.kids = ['', '']
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    expect(wrapper.findAll(Comment)).toHaveLength(a1.kids.length)
  })

  test('renders correctly', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    store.state.items.a1 = {
      by: 'eddeyerburgh',
      id: 15970740,
      kids: ['a2'],
      parent: 15970485,
      text: 'Old fallacies that keep coming back.',
      time: (dateNowTime / 1000) - 7000,
      type: 'comment'
    }
    store.state.items.a2 = {
      by: 'eddeyerburgh',
      id: 15970740,
      kids: null,
      parent: 15970485,
      text: 'Can you give three examples of different meanings?',
      time: (dateNowTime / 1000) - 6000,
      type: 'comment'
    }
    const wrapper = shallow(Comment, {
      localVue,
      store,
      propsData: {
        id: 'a1'
      }
    })
    dateNow.mockRestore()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
