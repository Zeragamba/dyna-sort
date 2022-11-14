Dyna-Sort
=========
Dynamic array sorters for JavaScript

Install
-------

- yarn: `yarn add dyna-sort`
- npm: `npm install --save dyna-sort`

Usage
-----

### createSorter(sortFn)

Use `createSorter` to wrap a sorting function and adds utility functions to
control ordering of elements when using the sorter. This allows for easier reuse
of a sorting function when the user is able to change which field is the primary
sorting.

```ts
import { createSorter } from "dyna-sort"

const numbers: number[] = [5, 4, 3, 2, 1]
const sorter = createSorter<number>((a, b) => a - b)

/** Can be used as a normal sorting function **/
console.log(numbers.sort(sorter)) //=> [1, 2, 3, 4, 5]

/** adds .decending() and .ascending() to allow toggling direction **/
console.log(numbers.sort(sorter.ascending())) //=> [1, 2, 3, 4, 5]
console.log(numbers.sort(sorter.decending())) //=> [5, 4, 3, 2, 1]

/** adds .nullsFirst() and .nullsLast() to handle where nulls should get moved in the list **/
const nullNumbers: (null | number)[] = [5, 4, null, 3, null, 2, 1]
console.log(nullNumbers.sort(sorter.nullsFirst())) //=> [null, null, 1, 2, 3, 4, 5]
console.log(nullNumbers.sort(sorter.nullsLast())) //=> [1, 2, 3, 4, 5, null, null]

/** methods can be fully chained together for full control of the sorting **/
console.log(nullNumbers.sort(sorter.decending().nullsFirst(true))) //=> [null, null, 5, 4, 3, 2, 1]
console.log(nullNumbers.sort(sorter.nullsFirst(false).ascending())) //=> [1, 2, 3, 4, 5, null, null]
```

#### sorter.ascending() and sorter.descending()

`.ascending()` and `.descending()` will alter the ordering of values to return
them in the default or inverse order. Also aliased as `.asc()` and `.desc()`
respectfully for ease of use.

```ts
import { sortBy, createSorter } from '@engineering-tools/dyna-sort'

type ChocoBar = { name: string, grams: number, price: number }
const chocoBars: ChocoBar[] = [
  { name: "Milk Chocolate", grams: 500, price: 7.00 },
  { name: "Milk Chocolate", grams: 250, price: 3.50 },
  { name: "Dark Chocolate", grams: 250, price: 3.50 },
]

const nameSorter = createSorter<ChocoBar>((a, b) => a.name.localeCompare(b.name))
const weightSorter = createSorter<ChocoBar>((a, b) => a.grams - b.grams)
const priceSorter = createSorter<ChocoBar>((a, b) => a.price - b.price)

chocolateBars.sort(nameSorter) // => Sorted by name
chocolateBars.sort(nameSorter.ascending()) // => Sorted by name explicitly
chocolateBars.sort(priceSorter.descending()) // => Sorted by higher prices first
chocolateBars.sort(sortBy(nameSorter, priceSorter.descending())) // => Sorted by name, then price descending
```

`.ascending()` can also optionally take a boolean value to toggle it between
ascending and descending order. This is useful for when the user can toggle
the ordering direction:

```ts
chocolateBars.sort(nameSorter.ascending(true)) // => Sorted by name ascending
chocolateBars.sort(nameSorter.ascending(false)) // => Sorted by name descending
```

#### sorter.nullsLast() and sorter.nullsFirst()

`.nullsLast()` and `.nullsFirst()` will allow for configuring where to put
null values. Both functions also take a flag to invert their usual setting.
Combine with `.ascending()` and `.descending()` to explicitly sort nonnull values

```ts
const value = createSorter<number>((a, b) => a - b)
const list = [null, 1, 2, 3, null]

list.sort(value.nullsLast()) // => [1, 2, 3, null, null]
list.sort(value.nullsLast(true)) // => [1, 2, 3, null, null]
list.sort(value.nullsLast(false)) // => [null, null, 1, 2, 3]
list.sort(value.ascending().nullsLast()) // => [1, 2, 3, null, null]
list.sort(value.descending().nullsLast()) // => [3, 2, 1, null, null]
```

### sortBy(...sortFns)

Sorting function that allows for sorting object by multiple fields.

For example, sorting ChocolateBars by name, weight, then by price:

```ts
import { createSorter, sortBy } from "dyna-sort"

type ChocoBar = { name: string, grams: number, price: number }
const chocoBars: ChocoBar[] = [
  { name: "Milk Chocolate", grams: 500, price: 7.00 },
  { name: "Milk Chocolate", grams: 250, price: 3.50 },
  { name: "Dark Chocolate", grams: 250, price: 3.50 },
]

const nameSorter = createSorter<ChocoBar>((a, b) => a.name.localeCompare(b.name))
const weightSorter = createSorter<ChocoBar>((a, b) => a.grams - b.grams)
const priceSorter = createSorter<ChocoBar>((a, b) => a.price - b.price)

console.log(cocobars.sort(sortBy(nameSorter, weightSorter, priceSorter))) /* => [
  {name: "Dark Chocolate", grams: 250, price: 3.50},
  {name: "Milk Chocolate", grams: 250, price: 3.50},
  {name: "Milk Chocolate", grams: 500, price: 7.00},
]*/
```

### sortArray(array, sortFn)

Utility function to immutably sort an array. Returns a new array with the
sorting applied.

```ts
import { sortArray } from "dyna-sort"

const listA = [3, 2, 1]
const listB = sortArray(listA, (a, b) => a - b)
console.log(listA) //=> [3,2,1]
console.log(listB) //=> [1,2,3]
```

### dateSorter & createDateSorter(getDate)

utility DateSorters for readability, providing `.newestFirst()` and `.oldestFirst()` 
helper functions. Use the exported `dateSorter` to sort dates directly, or use
`createDateSorter()` to sort objects by a date field.

```ts
import { dateSorter, createDateSorter } from "dyna-sort"

const oldestDate = new Date('2015-01-01')
const middleDate = new Date('2020-01-01')
const newestDate = new Date('2025-01-01')
const dates = [newestDate, oldestDate, middleDate]

dates.sort(dateSorter.newestFirst()) //=> [newestDate, middleDate, oldestDate]
dates.sort(dateSorter.oldestFirst()) //=> [oldestDate, middleDate, newestDate]
dates.sort(dateSorter.newestFirst(false)) //=> [oldestDate, middleDate, newestDate]

const Item = { createdAt: Date }
const oldestItem = { createdAt: oldestDate }
const middleItem = { createdAt: middleDate }
const newestItem = { createdAt: newestDate }

itemSorter = createDateSorter<Item>(item => item.createdAt)
dates.sort(itemSorter.newestFirst()) //=> [newestItem, middleItem, oldestItem]
dates.sort(itemSorter.oldestFirst()) //=> [oldestItem, middleItem, newestItem]
dates.sort(itemSorter.newestFirst(false)) //=> [oldestItem, middleItem, newestItem]
```
