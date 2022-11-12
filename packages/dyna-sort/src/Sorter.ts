import {sortBy} from "./Functions"
import {defaultOptions, SorterOptions} from "./SorterOptions"

export type SortFunction<Type> = (a: Type, b: Type) => number

export interface Sorter<Type> extends SortFunction<Type> {
  isSorter: true

  options: SorterOptions

  sortFn: SortFunction<Type>

  applyOptions: (options: Partial<SorterOptions>) => Sorter<Type>

  ascending(asc?: boolean): Sorter<Type>

  descending(): Sorter<Type>

  nullsFirst(first?: boolean): Sorter<null | undefined | Type>

  nullsLast(): Sorter<null | undefined | Type>
}

export function createSorter<Type>(sortFn: SortFunction<Type>, options: Partial<SorterOptions> = {}): Sorter<Type> {
  const sorter = ((a, b) => sorter.sortFn(a, b)) as Sorter<Type>
  sorter.isSorter = true

  sorter.sortFn = sortBy<Type>(
    (a, b) => {
      if (!sorter.options.nulls) return 0
      const result = nullSortFn(a, b)
      return sorter.options.nulls === 'first' ? result : result * -1
    },
    (a, b) => {
      const result = sortFn(a, b)
      return sorter.options.ascending ? result : result * -1
    },
  )

  sorter.options = {...defaultOptions, ...options}

  sorter.applyOptions = (options) => {
    return createSorter(sortFn, {...sorter.options, ...options})
  }

  sorter.ascending = (ascending = true) => {
    return sorter.applyOptions({ascending})
  }

  sorter.descending = () => sorter.ascending(false)

  sorter.nullsFirst = (nullsFirst = true) => {
    return sorter.applyOptions({nulls: nullsFirst ? "first" : "last"}) as Sorter<null | Type>
  }

  sorter.nullsLast = () => sorter.nullsFirst(false)

  return sorter
}

const nullSortFn: SortFunction<null | unknown> = (a, b) => {
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1
  return 0
}
