# TinyLocalStorageDB

A lightweight and flexible JavaScript library for managing a local database using the browser's localStorage. It provides functionalities like data compression, batch operations, usage statistics, and a simple query language for advanced data retrieval.

## Installation

```
npm install tiny-localstorage-db
```

## Usage
```
// Import the TinyLocalStorageDB class
const TinyLocalStorageDB = require('tiny-localstorage-db');

// Create a new instance of TinyLocalStorageDB
const db = new TinyLocalStorageDB();

// Set data
db.set('user1', { name: 'John', age: 30 });

// Get data
const userData = db.get('user1');
console.log(userData); // Output: { name: 'John', age: 30 }

// Remove data
db.remove('user1');

// Batch operations
const dataToSet = [
  { key: 'user1', value: { name: 'John', age: 30 } },
  { key: 'user2', value: { name: 'Jane', age: 25 } },
];
db.batchSet(dataToSet);

const keysToGet = ['user1', 'user2'];
const batchData = db.batchGet(keysToGet);
console.log(batchData);

const keysToRemove = ['user1', 'user2'];
db.batchRemove(keysToRemove);

// Query Language
const queryConditions = [{ key: 'age', operator: 'gt', value: 25 }];
const queryResult = db.selectQuery(queryConditions);
console.log(queryResult);

// Usage Statistics
console.log(db.usageStatistics.getUsageCount('user1'));

// Execute a query using timestamp conditions
const timestampQueryConditions = [
  { key: 'timestamp', operator: 'gt', value: '2023-01-01T00:00:00' },
];
const timestampQueryResult = db.selectQuery(timestampQueryConditions);
console.log(timestampQueryResult);
```

## API Documentation

``` set(key, value, compress = true) ```
Sets a key-value pair in the database.

key: The key for the data.
value: The value to be stored.
compress: Optional. If set to true (default), the data will be compressed before storage.

``` get(key, decompress = true) ```
Retrieves the value associated with the given key from the database.

key: The key to look up.
decompress: Optional. If set to true (default), the retrieved data will be decompressed.

``` remove(key) ```
Removes the key-value pair associated with the given key from the database.

key: The key to remove.

``` batchSet(dataArray, compress = true) ```
Sets multiple key-value pairs in the database using an array of objects.

dataArray: An array of objects, each containing a key and value.
compress: Optional. If set to true (default), the data will be compressed before storage.

``` batchGet(keysArray, decompress = true) ```
Retrieves values for multiple keys from the database.

keysArray: An array of keys to retrieve.
decompress: Optional. If set to true (default), the retrieved data will be decompressed.

``` batchRemove(keysArray) ```
Removes multiple key-value pairs from the database.

keysArray: An array of keys to remove.

``` selectQuery(conditions) ```
Executes a SELECT query on the database using the Query Language.

conditions: An array of conditions for the query. Each condition is an object with key, operator, and value.

``` executeQuery(key, value) ```
Deprecated. Use selectQuery for executing queries.

``` usageStatistics.getUsageCount(key) ```
Gets the usage count for a specific key in the database.

key: The key to get the usage count for.

## License
This project is licensed under the MIT License - see the LICENSE file for details.