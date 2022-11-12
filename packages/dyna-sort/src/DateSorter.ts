import {createSorter, Sorter, SortFunction} from "./Sorter"
import {SorterOptions} from "./SorterOptions"

export interface DateSorter<Type> extends Sorter<Type> {
  applyOptions: (options: Partial<SorterOptions>) => DateSorter<Type>
  newestFirst: (newestFirst?: boolean) => DateSorter<Type>
  oldestFirst: () => DateSorter<Type>
  nullsFirst: (nullsFirst?: boolean) => DateSorter<null | Type>
  nullsLast: () => DateSorter<null | Type>
}

export function createDateSorter<Type>(getDate: (item: Type) => Date, sorterOptions: Partial<SorterOptions> = {}): DateSorter<Type> {
  const sortFn: SortFunction<null | Type> = (a, b) => {
    const aTime = a !== null ? getDate(a).getTime() : -Infinity
    const bTime = a !== null ? getDate(b).getTime() : -Infinity
    return bTime - aTime
  }

  const sorter = createSorter<Type>(sortFn, sorterOptions) as DateSorter<Type>

  sorter.applyOptions = (options) => {
    return createDateSorter(getDate, {...sorter.options, ...options})
  }

  sorter.newestFirst = (newestFirst = true) => {
    return sorter.applyOptions({ascending: newestFirst})
  }

  sorter.oldestFirst = () => sorter.newestFirst(false)

  return sorter
}

export const dateSorter = createDateSorter<Date>((date) => date)
