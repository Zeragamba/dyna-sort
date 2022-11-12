import {createSorter} from "./Sorter"
import {shuffle} from "../test/util"

describe('Sorter', () => {
  const numbers = [1, 2, 3]
  const numbersWithNull = [null, null, null, 1, 2, 3]
  const sorter = createSorter<number>((a, b) => a - b)

  test('can be used as a normal sorting function', () => {
    expect(shuffle(numbers).sort(sorter)).toEqual([1, 2, 3])
  })

  test('.ascending() sorts items in ascending order', () => {
    expect(shuffle(numbers).sort(sorter.ascending())).toEqual([1, 2, 3])
  })

  test('.ascending(false) sorts items in descending order', () => {
    expect(shuffle(numbers).sort(sorter.ascending(false))).toEqual([3, 2, 1])
  })

  test('.descending() sorts items in descending order', () => {
    expect(shuffle(numbers).sort(sorter.descending())).toEqual([3, 2, 1])
  })

  test('.descending() and .ascending() can be chained', () => {
    expect(shuffle(numbers).sort(sorter.descending().ascending())).toEqual([1, 2, 3])
    expect(shuffle(numbers).sort(sorter.ascending().descending())).toEqual([3, 2, 1])
  })

  test('.nullsFirst() moves nulls to start of list', () => {
    expect(shuffle(numbersWithNull).sort(sorter.nullsFirst()))
      .toEqual([null, null, null, 1, 2, 3])
  })

  test('.nullsFirst(false) moves nulls to end of list', () => {
    expect(shuffle(numbersWithNull).sort(sorter.nullsFirst(false)))
      .toEqual([1, 2, 3, null, null, null])
  })

  test('.nullsLast() moves nulls to end of list', () => {
    expect(shuffle(numbersWithNull).sort(sorter.nullsLast()))
      .toEqual([1, 2, 3, null, null, null])
  })

  test('.nullsFirst() and .nullsLast() can be chained', () => {
    expect(shuffle(numbersWithNull).sort(sorter.nullsLast().nullsFirst()))
      .toEqual([null, null, null, 1, 2, 3])
    expect(shuffle(numbersWithNull).sort(sorter.nullsFirst().nullsLast()))
      .toEqual([1, 2, 3, null, null, null])
  })
})
