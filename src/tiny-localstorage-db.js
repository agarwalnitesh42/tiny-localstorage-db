const LZString = require('lz-string');

// tiny-localstorage-db.js
class TinyLocalStorageDB {
    constructor(options = {}) {
      this.storageKeyPrefix = options.prefix || 'tinydb_';
      this.maxSize = options.maxSize || 1024 * 1024; // 1MB default size
      this.lruCache = [];
    }
  
    set(key, value, compress = true) {
      // Compress data if requested
      const serializedValue = compress ? this.compress(value) : JSON.stringify(value);
  
      // Ensure data size does not exceed maxSize
      this.enforceSizeLimit(serializedValue.length);
  
      // Save data along with timestamp
      localStorage.setItem(this.getStorageKey(key), JSON.stringify({ value: serializedValue, timestamp: Date.now() }));
  
      // Update LRU cache
      this.updateLRUCache(key);
    }
  
    get(key, decompress = true) {
      const storageKey = this.getStorageKey(key);
      const storedData = localStorage.getItem(storageKey);
  
      if (storedData) {
        const { value, timestamp } = JSON.parse(storedData);
  
        // Update timestamp for LRU cache
        this.updateLRUCache(key);
  
        // Decompress data if requested
        return decompress ? this.decompress(value) : JSON.parse(value);
      }
  
      return null;
    }
  
    remove(key) {
      const storageKey = this.getStorageKey(key);
      localStorage.removeItem(storageKey);
  
      // Remove from LRU cache
      this.removeFromLRUCache(key);
    }
  
    has(key) {
      const storageKey = this.getStorageKey(key);
      return localStorage.getItem(storageKey) !== null;
    }
  
    enforceSizeLimit(dataSize) {
      const currentSize = this.calculateStorageSize();
      if (currentSize + dataSize > this.maxSize) {
        this.removeLRUData();
      }
    }
  
    calculateStorageSize() {
      // Calculate the total size of stored data in localStorage
      const totalSize = Object.keys(localStorage).reduce((size, key) => {
        return size + localStorage.getItem(key).length;
      }, 0);
  
      return totalSize;
    }
  
    compress(data) {
        try {
          // Use lz-string library for compression
          const compressedData = LZString.compress(JSON.stringify(data));
          return compressedData;
        } catch (error) {
          console.error('Compression error:', error.message);
          return data;
        }
      }
    
    decompress(data) {
        try {
            // Use lz-string library for decompression
            const decompressedData = JSON.parse(LZString.decompress(data));
            return decompressedData;
        } catch (error) {
            console.error('Decompression error:', error.message);
            return data;
        }
    }
  
    updateLRUCache(key) {
      // Update the LRU cache with the most recently used key
      this.removeFromLRUCache(key);
      this.lruCache.unshift(key);
    }
  
    removeFromLRUCache(key) {
      // Remove the specified key from the LRU cache
      const index = this.lruCache.indexOf(key);
      if (index !== -1) {
        this.lruCache.splice(index, 1);
      }
    }
  
    removeLRUData() {
      // Remove the least recently used data to free up space
      const oldestKey = this.lruCache.pop();
      if (oldestKey) {
        this.remove(oldestKey);
      }
    }
  
    getStorageKey(key) {
      // Generate a prefixed storage key
      return `${this.storageKeyPrefix}${key}`;
    }
  }
  
  module.exports = TinyLocalStorageDB;
  