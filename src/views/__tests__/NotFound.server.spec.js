/**
 * @jest-environment node
 */

import { renderToString, render } from '@vue/test-utils'
import NotFound from '../NotFound.vue'

test('renders correctly ', () => {
  const markupString = renderToString(NotFound)
  expect(markupString).toMatchSnapshot()
})

test('renders 404 inside <h1> tag', () => {
  const wrapper = render(NotFound)
  expect(wrapper.find('h1').text()).toBe('404')
})
