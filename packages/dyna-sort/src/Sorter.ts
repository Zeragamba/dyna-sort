import { sortBy } from './Functions'
import { defaultOptions, SorterOptions } from './SorterOptions'

/**
 * Node sort comparison function. @see Array#sort
 */
export type SortFunction<Type> = (a: Type, b: Type) => number

export interface Sorter<Type> extends SortFunction<Type> {
  /**
   * Flag to indicate the sorting function has been wrapped with DynaSort
   */
  isDynaSorter: true;

  /**
   * Options for the sorter
   */
  options: SorterOptions;

  /**
   * Sorting function to perform when the sorter is used
   * @private
   */
  _sortFn: SortFunction<Type>;

  /**
   * Merges current options with new options to produce a new Sorter
   */
  applyOptions: (options: Partial<SorterOptions>) => Sorter<Type>;

  /**
   * Creates a new sorter that sorts items in ascending order
   *
   * @example ```ts
   * const value = createSorter<number>((a, b) => a - b)
   * const list = [2, 1, 3]
   *
   * list.sort(value.ascending()) // => [1, 2, 3]
   * list.sort(value.ascending(true)) // => [1, 2, 3]
   * list.sort(value.ascending(false)) // => [3, 2, 1]
   * ```
   *
   * @param ascending Optionally toggle between ascending and descending orders
   */
  ascending (ascending?: boolean): Sorter<Type>;

  /**
   * Creates a new sorter that sorts items in descending order
   *
   * @example ```ts
   * const value = createSorter<number>((a, b) => a - b)
   * const list = [2, 1, 3]
   *
   * list.sort(value.descending()) // => [3, 2, 1]
   * ```
   */
  descending (): Sorter<Type>;

  /**
   * Creates a new sorter with null items sorting to the start of the list
   *
   * @example ```ts
   * const value = createSorter<number>((a, b) => a - b)
   * const list = [null, 1, 2, 3, null]
   *
   * list.sort(value.nullsFirst(true)) // => [null, null, 1, 2, 3]
   * list.sort(value.nullsFirst(false)) // => [1, 2, 3, null, null]
   * list.sort(value.ascending().nullsFirst()) // => [null, null, 1, 2, 3]
   * list.sort(value.descending().nullsFirst()) // => [null, null, 3, 2, 1]
   * ```
   *
   * @param nullsFirst Optionally toggle sorting nulls to end of the list
   */
  nullsFirst (nullsFirst?: boolean): Sorter<null | Type>;

  /**
   * Creates a new sorter with null items sorting to the end of the list
   *
   * @example ```ts
   * const value = createSorter<number>((a, b) => a - b)
   * const list = [null, 1, 2, 3, null]
   * list.sort(value.ascending().nullsLast()) // => [1, 2, 3, null, null]
   * list.sort(value.descending().nullsLast()) // => [3, 2, 1, null, null]
   * ```
   * @param nullsLast Optionally toggle sorting nulls to start of the list
   */
  nullsLast (nullsLast?: boolean): Sorter<null | Type>;
}

/**
 * Wraps a sorting function and adds utility functions to control ordering of
 * elements when using the sorter. This allows for easier reuse of a sorting
 * function when the user is able to change which field is the primary sorting.
 *
 * `.ascending()` and `.descending()` will alter the ordering of values to return
 * them in the default or inverse order.
 *
 * @example ```ts
 * import { sortBy, createSorter } from  '@engineering-tools/dyna-sort'
 *
 * const name = createSorter<ChocolateBar>((a, b) => a.name.localeCompare(b.name))
 * const price = createSorter<ChocolateBar>((a, b) => b.price - a.price)
 *
 * chocolateBars.sort(name) // => Sorted by name
 * chocolateBars.sort(name.ascending()) // => Sorted by name explicitly
 * chocolateBars.sort(price.descending()) // => Sorted by higher prices first
 * chocolateBars.sort(sortBy(name, price.descending())) // => Sorted by name, then price descending
 * ```
 *
 * `.ascending()` can also optionally take a boolean value to toggle it between
 * ascending and descending order. This is useful for when the user can toggle
 * the ordering direction:
 *
 * @example ```ts
 * chocolateBars.sort(name.ascending(true)) // => Sorted by name ascending
 * chocolateBars.sort(name.ascending(false)) // => Sorted by name descending
 * ```
 *
 * `.nullsLast()` and `.nullsFirst()` will allow for configuring where to put
 * null values. Both functions also take a flag to invert their usual setting.
 * Combine with `.ascending()` and `.descending()` to sort nonnull values
 *
 * @example ```ts
 * const value = createSorter<number>((a, b) => a - b)
 * const list = [null, 1, 2, 3, null]
 *
 * list.sort(value.nullsLast()) // => [1, 2, 3, null, null]
 * list.sort(value.nullsLast(true)) // => [1, 2, 3, null, null]
 * list.sort(value.nullsLast(false)) // => [null, null, 1, 2, 3]
 * list.sort(value.ascending().nullsLast()) // => [1, 2, 3, null, null]
 * list.sort(value.descending().nullsLast()) // => [3, 2, 1, null, null]
 * ```
 *
 * @param sortFn The sorting function to wrap. Must sort items in ascending order!
 * @param options options to apply to the sorter
 */
export function createSorter<Type> (sortFn: SortFunction<Type>, options: Partial<SorterOptions> = {}): Sorter<Type> {
  const sorter = ((a, b) => sorter._sortFn(a, b)) as Sorter<Type>
  sorter.isDynaSorter = true

  sorter._sortFn = sortBy<Type>(
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
