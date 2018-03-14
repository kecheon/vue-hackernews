import { mount } from '@vue/test-utils'
import Item from '../Item.vue'

describe('Item.vue', () => {
  test('renders item.score', () => {
    const item = {
      score: 10
    }
    const wrapper = mount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain(item.score)
  })

  test('renders item.by', () => {
    const item = {
      by: 'some author'
    }
    const wrapper = mount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain(item.by)
  })

  test('renders item.url', () => {
    const item = {
      url: 'some title'
    }
    const wrapper = mount(Item, {
      propsData: { item }
    })
    expect(wrapper.text()).toContain(item.url)
  })

  test('renders an a tag containing item.title', () => {
    const item = {
      title: 'some title',
      url: 'http://some-url.com'
    }
    const wrapper = mount(Item, {
      propsData: { item }
    })
    expect(wrapper.find('a').text()).toEqual(item.title)
  })

  test('renders an a tag with href item.url', () => {
    const item = {
      url: 'http://some-url.com'
    }
    const wrapper = mount(Item, {
      propsData: { item }
    })
    const aWrapper = wrapper.find('a')
    expect(aWrapper.element.getAttribute('href')).toBe(item.url)
  })

  test('renders the host name', () => {
    const item = {
      url: 'https://some-url.com/with-paths'
    }
    const wrapper = mount(Item, {
      propsData: {
        item
      }
    })
    expect(wrapper.text()).toContain('(some-url.com)')
  })

  test('renders the time since the last post', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    const item = {
      time: (dateNowTime / 1000) - 600
    }
    const wrapper = mount(Item, {
      propsData: {
        item
      }
    })
    dateNow.mockRestore()
    expect(wrapper.find('.time').text()).toBe('10 minutes ago')
  })

  test('renders correctly', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    const item = {
      by: 'eddyerburgh',
      id: 11122233,
      score: 10,
      time: (dateNowTime / 1000) - 600,
      title: 'vue-test-utils is released',
      type: 'story',
      url: 'https://vue-test-utils.vuejs.org/'
    }
    const wrapper = mount(Item, {
      propsData: {
        item
      }
    })
    dateNow.mockRestore()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders correctly when item has no url and has type top', () => {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2018')

    dateNow.mockImplementation(() => dateNowTime)

    const item = {
      by: 'eddyerburgh',
      id: 11122233,
      score: 10,
      time: (dateNowTime / 1000) - 600,
      title: 'vue-test-utils is released',
      type: 'top'
    }
    const wrapper = mount(Item, {
      propsData: {
        item
      }
    })
    dateNow.mockRestore()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
