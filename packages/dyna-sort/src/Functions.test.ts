import {createSorter, SortFunction} from "./Sorter"
import {sortArray, sortBy} from "./Functions"
import {shuffle} from "../test/util"

describe('sortArray()', () => {
  const sorter: SortFunction<number> = (a, b) => a - b

  test('sorts arrays immutably', () => {
    const array = [3, 1, 2]
    expect(sortArray(array, sorter)).not.toStrictEqual(array)
  })
})

describe('sortBy()', () => {
  type Item = { first: number, second: number }

  const items: Item[] = [
    {first: 1, second: 1},
    {first: 1, second: 2},
    {first: 1, second: 3},
    {first: 2, second: 1},
    {first: 2, second: 2},
    {first: 2, second: 3},
  ]

  const firstSorter = createSorter<Item>((a, b) => a.first - b.first)
  const secondSorter = createSorter<Item>((a, b) => a.second - b.second)


  test('sorts items with priority', () => {
    expect(shuffle(items).sort(sortBy(firstSorter, secondSorter))).toEqual([
      {first: 1, second: 1},
      {first: 1, second: 2},
      {first: 1, second: 3},
      {first: 2, second: 1},
      {first: 2, second: 2},
      {first: 2, second: 3},
    ])

    expect(shuffle(items).sort(sortBy(firstSorter.descending(), secondSorter))).toEqual([
      {first: 2, second: 1},
      {first: 2, second: 2},
      {first: 2, second: 3},
      {first: 1, second: 1},
      {first: 1, second: 2},
      {first: 1, second: 3},
    ])

    expect(shuffle(items).sort(sortBy(secondSorter, firstSorter))).toEqual([
      {first: 1, second: 1},
      {first: 2, second: 1},
      {first: 1, second: 2},
      {first: 2, second: 2},
      {first: 1, second: 3},
      {first: 2, second: 3},
    ])
  })
})
