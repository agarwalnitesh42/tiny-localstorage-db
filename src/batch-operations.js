// batch-operations.js
class BatchOperations {
    constructor() {}
  
    // Batch set operation to set multiple key-value pairs
    batchSet(dataArray, compress = true) {
      dataArray.forEach(({ key, value }) => {
        this.set(key, value, compress);
      });
    }
  
    // Batch get operation to retrieve values for multiple keys
    batchGet(keysArray, decompress = true) {
      return keysArray.map((key) => this.get(key, decompress));
    }
  
    // Batch remove operation to remove multiple keys
    batchRemove(keysArray) {
      keysArray.forEach((key) => this.remove(key));
    }
}
  
module.exports = BatchOperations;
  