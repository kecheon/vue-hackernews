import getters from '../getters'

describe('getters', () => {
  test('displayItems returns items 20-40 if page is 2', () => {
    const numberArray = Array(40).fill().map((v, i) => i) // #A
    const result = getters.displayItems({ // #B
      items: numberArray,
      route: {
        params: {
          page: 2 // #C
        }
      }
    })
    expect(result.length).toEqual(20) // #D
    for (let i = 0; i < 20; i++) { // #E
      expect(result[i]).toEqual(numberArray[i + 20])
    }
  })

  test('displayItems returns remaining items if there are not enough remaining items', () => {
    const numberArray = Array(21).fill().map((v, i) => i) // #A
    const store = {
      items: numberArray,
      route: {
        params: { page: 2 }
      }
    }
    const result = getters.displayItems(store)
    expect(result.length).toEqual(1) // #B
    expect(result[0]).toBe(numberArray[20]) // #C})
  })
})
