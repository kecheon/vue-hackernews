jest.mock('../../api/api')

import actions from '../actions'
import { fetchListData } from '../../api/api'
import flushPromises from 'flush-promises'

describe('actions', () => {
  test('fetchListData calls commit with setItems and the result of fetchListData', async () => {
    const items = [{}, {}] // #A
    const type = 'top'
    fetchListData.mockImplementation(calledWith => { // #B
      return calledWith === type
        ? Promise.resolve(items)
        : Promise.resolve()
    })
    const context = { // #C
      commit: jest.fn()
    }
    actions.fetchListData(context, { type }) // #D
    await flushPromises() // #E
    expect(context.commit).toHaveBeenCalledWith('setItems', { items }) // #F
  })
})
