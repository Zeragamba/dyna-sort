export interface SorterOptions {
  /**
   * Toggles the sorter to return items in ascending order
   */
  ascending: boolean,

  /**
   * Configures how the sorter should sort null items.
   */
  nulls: false | 'first' | 'last'
}

export const defaultOptions: SorterOptions = {
  ascending: true,
  nulls: false,
}
