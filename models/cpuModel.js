const mongoose = require('mongoose');

const cpuSchema = new mongoose.Schema({
  cpuName: String,
  price: Number,
  cpuMark: Number,
  cpuValue: Number,
  threadMark: Number,
  threadValue: Number,
  TDP: String,
  powerPerf: Number,
  cores: Number,
  testDate: String,
  socket: String,
  category: String,
});

const CPUs = mongoose.model('CPUs', cpuSchema);

module.exports = CPUs;
