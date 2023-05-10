const mongoose = require('mongoose');

const cpuSchema = new mongoose.Schema({
  partName: String,
  manufacturer: String,
  releaseDate:String,
  socket:String,
});

const CPUs = mongoose.model('CPUs', cpuSchema);

module.exports = CPUs;
