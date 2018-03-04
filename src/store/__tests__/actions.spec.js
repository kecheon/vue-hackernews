jest.mock('../../api/api')

import actions from '../actions'
import { fetchIdsByType, fetchItems } from '../../api/api'
import flushPromises from 'flush-promises'

describe('actions', () => {
  test('fetchListData calls commit with setActiveType and the type', () => {
    const type = 'top'
    const context = {
      commit: jest.fn(),
      getters: {},
      dispatch: jest.fn()
    }

    actions.fetchListData(context, { type })
    expect(context.commit).toHaveBeenCalledWith('setActiveType', { type })
  })

  test('fetchListData calls commit with setIds and the result of fetchIdsByType', async () => {
    const ids = ['a1', 'a2']
    const type = 'top'
    const context = {
      commit: jest.fn(),
      getters: {}
    }
    fetchIdsByType.mockImplementation(calledWith => {
      return calledWith === type
        ? Promise.resolve(ids)
        : Promise.resolve()
    })
    actions.fetchListData(context, { type })
    await flushPromises()
    expect(context.commit).toHaveBeenCalledWith('setIds', { ids })
  })

  test('fetchListData calls calls commit with the result of fetchItems', async () => {
    const type = 'top'
    const ids = ['a1', 'a2', 'a3']
    const activeIds = ['a2', 'a3']
    const items = [{id: 'a2'}, {id: 'a3'}]
    const context = {
      commit: jest.fn(),
      getters: {
        activeIds
      }
    }
    fetchIdsByType.mockImplementation(() => Promise.resolve(ids))
    fetchItems.mockImplementation(calledWith => {
      return calledWith === activeIds
      ? Promise.resolve(items)
      : Promise.resolve()
    })
    actions.fetchListData(context, { type })
    await flushPromises()
    expect(context.commit).toHaveBeenLastCalledWith('setItems', { items: items })
  })
})
