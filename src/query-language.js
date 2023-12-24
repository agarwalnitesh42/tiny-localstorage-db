// query-language.js
class QueryLanguage {
    constructor() {}
  
    // Execute a SELECT query with conditions
    select(dataArray, conditions) {
      // Apply conditions to filter the data
      return dataArray.filter((item) => this.checkConditions(item, conditions));
    }
  
    // Helper function to check if an item satisfies all conditions
    checkConditions(item, conditions) {
      return conditions.every((condition) => this.checkCondition(item, condition));
    }
  
    // Helper function to check if an item satisfies a single condition
    checkCondition(item, condition) {
      const { key, operator, value } = condition;
  
      switch (operator) {
        case 'eq':
          return this.handleEqualityCondition(item, key, value);
        case 'ne':
          return this.handleInequalityCondition(item, key, value);
        case 'gt':
          return this.handleGreaterThanCondition(item, key, value);
        case 'lt':
          return this.handleLessThanCondition(item, key, value);
        default:
          return false;
      }
    }
  
    // Helper function to handle equality condition
    handleEqualityCondition(item, key, value) {
      if (key === 'timestamp') {
        // For timestamp, check if it falls on the same day (ignoring time)
        const itemDate = new Date(item[key]);
        const valueDate = new Date(value);
        return (
          itemDate.getFullYear() === valueDate.getFullYear() &&
          itemDate.getMonth() === valueDate.getMonth() &&
          itemDate.getDate() === valueDate.getDate()
        );
      } else {
        // For other keys, perform a simple equality check
        return item[key] === value;
      }
    }
  
    // Helper function to handle inequality condition
    handleInequalityCondition(item, key, value) {
      if (key === 'timestamp') {
        // For timestamp, check if it does not fall on the same day (ignoring time)
        return !this.handleEqualityCondition(item, key, value);
      } else {
        // For other keys, perform a simple inequality check
        return item[key] !== value;
      }
    }
  
    // Helper function to handle greater than condition
    handleGreaterThanCondition(item, key, value) {
      if (key === 'timestamp') {
        // For timestamp, check if it is after the specified date
        return new Date(item[key]) > new Date(value);
      } else {
        // For other keys, perform a simple greater than check
        return item[key] > value;
      }
    }
  
    // Helper function to handle less than condition
    handleLessThanCondition(item, key, value) {
      if (key === 'timestamp') {
        // For timestamp, check if it is before the specified date
        return new Date(item[key]) < new Date(value);
      } else {
        // For other keys, perform a simple less than check
        return item[key] < value;
      }
    }
  }
  
  module.exports = QueryLanguage;
  