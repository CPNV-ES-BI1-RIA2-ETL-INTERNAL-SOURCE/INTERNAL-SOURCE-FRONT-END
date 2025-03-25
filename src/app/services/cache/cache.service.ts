import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private defaultTTL: number = environment.cache.defaultTTL;
  private readonly prefix: string = environment.cache.storage.prefix;

  constructor() {}

  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Set data in cache with optional TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Optional TTL (default is environment.cache.defaultTTL)
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const storageKey = this.getStorageKey(key);
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now() + ttl,
    };
    localStorage.setItem(storageKey, JSON.stringify(cacheItem));
  }

  /**
   * Get data from cache
   * @param key Cache key
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    const storageKey = this.getStorageKey(key);
    const item = localStorage.getItem(storageKey);

    if (!item) {
      return null;
    }

    const cacheItem: CacheItem<T> = JSON.parse(item);
    if (Date.now() > cacheItem.timestamp) {
      localStorage.removeItem(storageKey);
      return null;
    }

    return cacheItem.data;
  }

  /**
   * Remove item from cache
   * @param key Cache key
   */
  remove(key: string): void {
    localStorage.removeItem(this.getStorageKey(key));
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    // Remove all items with our prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  /**
   * Check if key exists in cache and is not expired
   * @param key Cache key
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Set default TTL for cache items
   * @param ttl Time to live in milliseconds
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}
