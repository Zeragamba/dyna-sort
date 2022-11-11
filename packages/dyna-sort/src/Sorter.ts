export type SortFunction<Type> = (a: Type, b: Type) => number

export interface SorterOptions {
  ascending: boolean
}

export interface Sorter<Type> extends SortFunction<Type> {
  options: {
    ascending: boolean,
  }

  ascending(asc?: boolean): Sorter<Type>

  descending(): Sorter<Type>
}

const defaultOptions: SorterOptions = {
  ascending: true,
}

export function createSorter<Type>(sortFn: SortFunction<Type>, options: Partial<SorterOptions> = {}): Sorter<Type> {
  options = {...defaultOptions, ...options}

  function ascending(ascending = true) {
    return createSorter(sortFn, {...options, ascending})
  }

  function descending() {
    return ascending(false)
  }

  const sorter = ((a: Type, b: Type) => {
    const result = sortFn(a, b)
    return options.ascending ? result : result * -1
  }) as Sorter<Type>

  sorter.ascending = ascending
  sorter.descending = descending

  return sorter
}
