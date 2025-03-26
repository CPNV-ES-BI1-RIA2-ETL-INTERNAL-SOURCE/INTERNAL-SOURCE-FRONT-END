/**
 * The interface for the cache item
 */
export interface CacheItem<T> {
  /**
   * The data to be cached
   */
  data: T;
  /**
   * The timestamp of when the data was cached
   */
  timestamp: number;
}
