import {Sorter, SortFunction} from "./Sorter"

/**
 * Immutable sorting utility function
 * @param array
 * @param sortFn
 */
export function sortArray<Type>(array: Type[], sortFn: SortFunction<Type>): Type[] {
  return [...array].sort(sortFn)
}

export function sortBy<Type>(...sortFns: SortFunction<Type>[]): SortFunction<Type> {
  return (a: Type, b: Type) => {
    for (const sortFn of sortFns) {
      const result = sortFn(a, b)
      if (result != 0) return result
    }

    return 0
  }
}


export function isSorter<Type>(sortFn: unknown): sortFn is Sorter<Type> {
  return (sortFn as Sorter<Type>).isSorter
}
