import getters from '../getters'

describe('getters', () => {
  test('activeIds returns the first 20 items from state.ids', () => {
    var numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
    const state = {
      ids: numberArray,
      route: {
        params: {}
      }
    }
    const result = getters.activeIds(state)
    expect(result.length).toEqual(20)
    for (let i = 0; i < 20; i++) {
      expect(result[i]).toEqual(numberArray[i])
    }
  })

  test('activeIds returns ids 20-40 if page is 2', () => { // #A
    const numberArray = Array(40).fill().map((v, i) => i)
    const result = getters.activeIds({
      ids: numberArray,
      route: {
        params: {
          page: 2
        }
      }
    }) // #B
    expect(result.length).toEqual(20)
    for (let i = 0; i < 20; i++) { // #C
      expect(result[i]).toEqual(numberArray[i + 20])
    }
  })

  test('returns remaining ids after 20 if page is 2 and there are 21 ids', () => {
    const route = {
      params: {
        page: 2
      }
    }
// Create array of 21 numbers, each item contains the index
    const numberArray = Array(21).fill().map((v, i) => i)
    const store = {
      ids: numberArray,
      route
    }
    const result = getters.activeIds(store)
    expect(result.length).toEqual(1)
    expect(result[0]).toBe(numberArray[20])
  })
})
