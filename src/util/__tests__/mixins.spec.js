import { mount } from 'vue-test-utils'
import { titleMixin } from '../mixins'

describe('titleMixin', () => {
  test('set document.title using component title property', () => {
    const Component = {
      title: 'dummy title',
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('Vue HN | dummy title')
  })

  test(' sets document.title using result of title if it is a function ', () => {
    const Component = {
      data () {
        return {
          titleValue: 'another dummy title'
        }
      },
      title () {
        return this.titleValue
      },
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('Vue HN | another dummy title')
  })

  test('does not sets document.title title property does not exist', () => {
    document.title = 'some title'
    const Component = {
      mixins: [titleMixin]
    }
    mount(Component)
    expect(document.title).toBe('some title')
  })
})
