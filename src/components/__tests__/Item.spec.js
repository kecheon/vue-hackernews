import { mount } from 'vue-test-utils'
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

  test('renders an <a> tag containing item.title', () => {
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
    expect(aWrapper.attributes().href).toBe(item.url)
  })

  test('renders the time since the last post', () => {
    const dateNow = jest.spyOn(Date, 'now') // #A
    const dateNowTime = new Date('2018') // #B

    dateNow.mockImplementation(() => dateNowTime) // #C

    const item = { // #D
      time: (dateNowTime / 1000) - 600 // #E
    }
    const wrapper = mount(Item, {
      propsData: {
        item
      }
    })
    dateNow.mockRestore() // #F
    expect(wrapper.text()).toContain('10 minutes ago') // #G
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
})
