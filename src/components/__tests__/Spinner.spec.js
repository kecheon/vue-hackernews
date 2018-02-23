import { mount } from '@vue/test-utils'
import Spinner from '../Spinner.vue'

describe('Spinner.vue', () => {
  test('renders correctly', () => {
    expect(mount(Spinner).html()).toMatchSnapshot()
  })
})
