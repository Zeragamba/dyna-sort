import {shuffle} from "../test/util"
import {createDateSorter, dateSorter} from "./DateSorter"

describe('createDateSorter', () => {
  type Item = { createdAt: Date }
  const oldest: Item = {createdAt: new Date('2015-01-01')}
  const middle: Item = {createdAt: new Date('2020-01-01')}
  const newest: Item = {createdAt: new Date('2025-01-01')}
  const dates = [newest, oldest, middle]

  it('creates a dateSorter', () => {
    const sorter = createDateSorter<Item>((item) => item.createdAt)
    expect(dates.sort(sorter.newestFirst())).toEqual([newest, middle, oldest])
  })
})

describe('dateSorter', () => {
  const oldest = new Date('2015-01-01')
  const middle = new Date('2020-01-01')
  const newest = new Date('2025-01-01')
  const dates = [newest, oldest, middle]
  const datesWithNulls = [null, null, null, newest, oldest, middle]

  test('sorts items with newest first by default', () => {
    expect(shuffle(dates).sort(dateSorter)).toEqual([newest, middle, oldest])
  })

  test('.newestFirst() sorts items with newest first', () => {
    expect(shuffle(dates).sort(dateSorter.newestFirst())).toEqual([newest, middle, oldest])
  })

  test('.newestFirst(true) sorts items with newest first', () => {
    expect(shuffle(dates).sort(dateSorter.newestFirst(true))).toEqual([newest, middle, oldest])
  })

  test('.newestFirst(false) sorts items with oldest first', () => {
    expect(shuffle(dates).sort(dateSorter.newestFirst(false))).toEqual([oldest, middle, newest])
  })

  test('.oldestFirst() sorts items with oldest first', () => {
    expect(shuffle(dates).sort(dateSorter.oldestFirst())).toEqual([oldest, middle, newest])
  })

  test('.newestFirst() and .oldestFirst() can be changed', () => {
    expect(shuffle(dates).sort(dateSorter.oldestFirst().newestFirst())).toEqual([newest, middle, oldest])
    expect(shuffle(dates).sort(dateSorter.newestFirst().oldestFirst())).toEqual([oldest, middle, newest])
  })

  test('.newestFirst() can be changed with .nullsFirst() and .nullsLast()', () => {
    expect(shuffle(datesWithNulls).sort(dateSorter.newestFirst().nullsFirst())).toEqual([null, null, null, newest, middle, oldest])
    expect(shuffle(datesWithNulls).sort(dateSorter.nullsFirst().newestFirst())).toEqual([null, null, null, newest, middle, oldest])
    expect(shuffle(datesWithNulls).sort(dateSorter.newestFirst().nullsLast())).toEqual([newest, middle, oldest, null, null, null])
    expect(shuffle(datesWithNulls).sort(dateSorter.nullsLast().newestFirst())).toEqual([newest, middle, oldest, null, null, null])
  })

  test('.oldestFirst() can be changed with .nullsFirst() and .nullsLast()', () => {
    expect(shuffle(datesWithNulls).sort(dateSorter.oldestFirst().nullsFirst())).toEqual([null, null, null, oldest, middle, newest])
    expect(shuffle(datesWithNulls).sort(dateSorter.nullsFirst().oldestFirst())).toEqual([null, null, null, oldest, middle, newest])
    expect(shuffle(datesWithNulls).sort(dateSorter.oldestFirst().nullsLast())).toEqual([oldest, middle, newest, null, null, null])
    expect(shuffle(datesWithNulls).sort(dateSorter.nullsLast().oldestFirst())).toEqual([oldest, middle, newest, null, null, null])
  })
})
