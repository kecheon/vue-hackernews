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
    const activeIds = ['a2', 'a3'] // #A The result of getters.activeIds
    const items = [{id: 'a2'}, {id: 'a3'}] // #B The array to be returned by fetchIdsByType
    const context = {
      commit: jest.fn(),
      getters: {
        activeIds // #C Set the activeIds gettert to be the activeIds. We can assume the activeIds getter is correct because we are testing that we commit setList in the previous test, and we have a seperate test for the activeIds getter
      }
    }
    fetchIdsByType.mockImplementation(() => Promise.resolve(ids)) // #D No need to check that fetchIdsByType is called with the correct argument, because we already have a test checking that
    fetchItems.mockImplementation(calledWith => { // #E Only return the items if fetchItems is called with the activeIds value
      return calledWith === activeIds
      ? Promise.resolve(items)
      : Promise.resolve()
    })
    actions.fetchListData(context, { type })
    await flushPromises()
    expect(context.commit).toHaveBeenLastCalledWith('setItems', { items: items }) // #F Check commit was called with the correct arguments, after the pre
  })
})
