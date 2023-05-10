const mongoose = require('mongoose');

const gpuModel = new mongoose.Schema({
  partName: String,
  manufacturer: String,
  releaseDate:String,
  socket:String,
});

const Cpu = mongoose.model('CPUs', cpuSchema);

module.exports = CPUs;
