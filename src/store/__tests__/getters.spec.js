import getters from '../getters'

describe('getters', () => {
  test('activeIds returns the first 20 items from state.list', () => {
    var numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] // #A
    const state = { // #B
      items: [...numberArray]
    }
    const result = getters.displayItems(state) // #C
    expect(result.length).toEqual(20)
    result.forEach((item, i) => { // #D
      expect(item).toEqual(numberArray[i])
    })
  })
})
