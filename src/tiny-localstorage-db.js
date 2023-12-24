// Import the lz-string library
const LZString = require('lz-string');
const BatchOperations = require('./batch-operations');
const UsageStatistics = require('./usage-statistics');
const QueryLanguage = require('./query-language');

// tiny-localstorage-db.js
class TinyLocalStorageDB extends BatchOperations {
  constructor(options = {}) {
    super();
    this.storageKeyPrefix = options.prefix || 'tinydb_';
    this.maxSize = options.maxSize || 1024 * 1024; // 1MB default size
    this.lruCache = [];
    this.usageStatistics = new UsageStatistics();
    this.queryLanguage = new QueryLanguage();
  }

  // Execute a SELECT query using the Query Language
  selectQuery(conditions) {
    const keysArray = Object.keys(localStorage).map((storageKey) => {
      return storageKey.replace(this.storageKeyPrefix, '');
    });

    const dataArray = this.batchGet(keysArray);

    return this.queryLanguage.select(dataArray, conditions);
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

    // Track usage statistics
    this.usageStatistics.trackUsage(key);
  }

  get(key, decompress = true) {
    // Retrieve data based on the key
    const storageKey = this.getStorageKey(key);
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      // If data exists, parse it and update the timestamp for LRU cache
      const { value, timestamp } = JSON.parse(storedData);
      this.updateLRUCache(key);

      // Decompress data if requested
      return decompress ? this.decompress(value) : JSON.parse(value);
    }

    return null;
  }

  remove(key) {
    // Remove data based on the key
    const storageKey = this.getStorageKey(key);
    localStorage.removeItem(storageKey);

    // Remove from LRU cache
    this.removeFromLRUCache(key);
  }

  has(key) {
    // Check if data with the given key exists
    const storageKey = this.getStorageKey(key);
    return localStorage.getItem(storageKey) !== null;
  }

  enforceSizeLimit(dataSize) {
    // Check and remove old data if adding the new data exceeds the maxSize
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
    // Compress data using lz-string library
    try {
      const compressedData = LZString.compress(JSON.stringify(data));
      return compressedData;
    } catch (error) {
      console.error('Compression error:', error.message);
      return data;
    }
  }

  decompress(data) {
    // Decompress data using lz-string library
    try {
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

// Export the TinyLocalStorageDB class for use as an npm library
module.exports = TinyLocalStorageDB;
