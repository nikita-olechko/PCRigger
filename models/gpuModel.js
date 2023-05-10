const mongoose = require('mongoose');

const gpuSchema = new mongoose.Schema({
  partName: String,
  manufacturer: String,
  releaseDate:String,
  socket:String,
});

const GPUs = mongoose.model('CPUs', gpuSchema);

module.exports = GPUs;
