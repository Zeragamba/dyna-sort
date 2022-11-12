export interface SorterOptions {
  ascending: boolean,
  nulls: false | 'first' | 'last'
}

export const defaultOptions: SorterOptions = {
  ascending: true,
  nulls: false,
}
