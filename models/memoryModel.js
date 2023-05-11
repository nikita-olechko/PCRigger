const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  memoryName: String,
  capacity: String,
  gen: String,
  latency: Number,
  readUncached: Number,
  write: Number,
});

const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
