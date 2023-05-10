const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  name: String,
  gen: String,
});

const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
