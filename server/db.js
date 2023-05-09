/*
  Simple database implementation available during runtime
  for storing key-value pairs in a hash map
*/

class Database {
  constructor() {
    this.db = {};
  }

  get(key) {
    return this.db[key];
  }

  set(key, value) {
    this.db[key] = value;
  }
}

module.exports = Database;
