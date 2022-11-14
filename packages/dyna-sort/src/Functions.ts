import {Sorter, SortFunction} from "./Sorter"

/**
 * Utility function to immutably sort an array. Returns a new array with the
 * sorting applied.
 *
 * @example ```ts
 * import { sortArray, sortBy } from '@engineering-tools/dyna-sort'
 *
 * sortArray(chocolateBars, sortBy(
 *   (a, b) => a.name.localeCompare(b.name), //sort by Name ascending first
 *   (a, b) => a.price - b.price, // then by price ascending
 *   (a, b) => a.weight - b.weight, // then by weight ascending
 * ))
 * ```
 *
 * @param array Array of data to sort
 * @param sortFn Sort function to apply
 */
export function sortArray<Type>(array: Type[], sortFn: SortFunction<Type>): Type[] {
  return [...array].sort(sortFn)
}

/**
 * Sorting function that allows for sorting object by multiple fields.
 *
 * For example, allows for sorting ChocolateBars by name, then by price:
 * @example ```ts
 * import { sortBy } from '@engineering-tools/dyna-sort'
 *
 * type ChocolateBar = { name: string, price: number, weight: number }
 * const chocolateBars: ChocolateBar[] = [
 *   { name: "Salted Caramel", price: 3.00, weight: 500 },
 *   { name: "Milk Chocolate", price: 2.50, weight: 500 },
 *   { name: "Milk Chocolate", price: 5.00, weight: 1000 },
 * ]
 *
 * chocolateBars.sort(sortBy(
 *   (a, b) => a.name.localeCompare(b.name), //sort by Name ascending first
 *   (a, b) => a.price - b.price, // then by price ascending
 *   (a, b) => a.weight - b.weight, // then by weight ascending
 * ))
 * ```
 *
 * @param sortFns List of sorting functions to apply in order
 */
export function sortBy<Type>(...sortFns: SortFunction<Type>[]): SortFunction<Type> {
  return (a: Type, b: Type) => {
    for (const sortFn of sortFns) {
      const result = sortFn(a, b)
      if (result !== 0) return result
    }

    return 0
  }
}


/**
 * Type checker to see if a sorting function is wrapped by DynaSort
 */
export function isSorter<Type>(sortFn: unknown): sortFn is Sorter<Type> {
  if (typeof sortFn != 'function') return false
  return (sortFn as Sorter<Type>).isDynaSorter
}
