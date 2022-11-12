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

Wraps a sorting function with utility methods

```ts
import {createSorter} from "dyna-sort"

const numbers: number[] = [5, 4, 3, 2, 1]
const sorter = createSorter<number>((a, b) => a - b)

/** Can be used as a normal sorting function **/
console.log(numbers.sort(sorter)) //=> [1, 2, 3, 4, 5]

/** adds .decending() and .ascending() to allow toggling direction **/
console.log(numbers.sort(sorter.ascending())) //=> [1, 2, 3, 4, 5]
console.log(numbers.sort(sorter.decending())) //=> [5, 4, 3, 2, 1]

/** .ascending() also takes a boolean to toggle direction **/
console.log(numbers.sort(sorter.ascending(true))) //=> [1, 2, 3, 4, 5]
console.log(numbers.sort(sorter.decending(false))) //=> [5, 4, 3, 2, 1]

/** adds .nullsFirst() and .nullsLast() to handle where nulls should get moved in the list **/
const nullNumbers: (null | number)[] = [5, 4, null, 3, null, 2, 1]
console.log(nullNumbers.sort(sorter.nullsFirst())) //=> [null, null, 1, 2, 3, 4, 5]
console.log(nullNumbers.sort(sorter.nullsLast())) //=> [1, 2, 3, 4, 5, null, null]

/** .nullsFirst() can also take a boolean to toggle direction **/
console.log(nullNumbers.sort(sorter.nullsFirst(true))) //=> [null, null, 1, 2, 3, 4, 5]
console.log(nullNumbers.sort(sorter.nullsFirst(false))) //=> [1, 2, 3, 4, 5, null, null]

/** methods can be fully chained together for full control of the sorting **/
console.log(nullNumbers.sort(sorter.decending().nullsFirst(true))) //=> [null, null, 5, 4, 3, 2, 1]
console.log(nullNumbers.sort(sorter.nullsFirst(false))) //=> [1, 2, 3, 4, 5, null, null]

```

### sortBy(...sortFns)

Creates a sorting function that can sort with priority

```ts
import {createSorter, sortBy} from "dyna-sort"

type ChocoBar = { name: string, grams: number, price: number }
const chocoBars: ChocoBar[] = [
  {name: "Milk Chocolate", grams: 500, price: 7.00},
  {name: "Milk Chocolate", grams: 250, price: 3.50},
  {name: "Dark Chocolate", grams: 250, price: 3.50},
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

Immutably sorts an array, leaving the original alone

```ts
import {sortArray} from "dyna-sort"

const listA = [3, 2, 1]
const listB = sortArray(listA, (a, b) => a - b)
console.log(listA) //=> [3,2,1]
console.log(listB) //=> [1,2,3]
```

### dateSorter & createDateSorter

utility DateSorters for readability

```ts
import {dateSorter, createDateSorter} from "dyna-sort"


const oldestDate = new Date('2015-01-01')
const middleDate = new Date('2020-01-01')
const newestDate = new Date('2025-01-01')
const dates = [newestDate, oldestDate, middleDate]

dates.sort(dateSorter.newestFirst()) //= [newestDate, middleDate, oldestDate]
dates.sort(dateSorter.oldestFirst()) //= [oldestDate, middleDate, newestDate]
dates.sort(dateSorter.newestFirst(false)) //= [oldestDate, middleDate, newestDate]

const Item = {createdAt: Date}
const oldestItem = {createdAt: oldestDate}
const middleItem = {createdAt: middleDate}
const newestItem = {createdAt: newestDate}

itemSorter = createDateSorter<Item>(item => item.createdAt)
dates.sort(itemSorter.newestFirst()) //= [newestItem, middleItem, oldestItem]
dates.sort(itemSorter.oldestFirst()) //= [oldestItem, middleItem, newestItem]
dates.sort(itemSorter.newestFirst(false)) //= [oldestItem, middleItem, newestItem]
```
