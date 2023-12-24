// usage-statistics.js
class UsageStatistics {
    constructor() {
      this.statistics = {};
    }
  
    // Track usage statistics for a key
    trackUsage(key) {
      if (!this.statistics[key]) {
        this.statistics[key] = 1;
      } else {
        this.statistics[key]++;
      }
    }
  
    // Get the usage count for a key
    getUsageCount(key) {
      return this.statistics[key] || 0;
    }
}
  
module.exports = UsageStatistics;
  