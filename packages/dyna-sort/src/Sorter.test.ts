import {createSorter} from "./Sorter"

describe('Sorter', () => {
  const sorter = createSorter<number>((a, b) => a - b)

  test('can be used as a normal sorting function', () => {
    expect([3, 1, 2].sort(sorter)).toEqual([1, 2, 3])
  })

  test('.ascending() sorts items in ascending order', () => {
    expect([3, 1, 2].sort(sorter.ascending())).toEqual([1, 2, 3])
  })

  test('.ascending(false) sorts items in descending order', () => {
    expect([3, 1, 2].sort(sorter.ascending(false))).toEqual([3, 2, 1])
  })

  test('.descending() sorts items in descending order', () => {
    expect([3, 1, 2].sort(sorter.descending())).toEqual([3, 2, 1])
  })

  test('.descending() and .ascending() can be chained', () => {
    expect([3, 1, 2].sort(sorter.descending().ascending())).toEqual([1, 2, 3])
    expect([3, 1, 2].sort(sorter.ascending().descending())).toEqual([3, 2, 1])
  })
})
