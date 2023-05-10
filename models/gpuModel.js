const mongoose = require('mongoose');

const gpuSchema = new mongoose.Schema({
  "manufacturer": String,
  "productName": String,
  "releaseYear": Number,
  "memSize": Number,
  "memBusWidth": Number,
  "gpuClock": Number,
  "memClock": Number,
  "unifiedShader": Number,
  "tmu": Number,
  "rop": Number,
  "pixelShader": Number,
  "vertexShader": Number,
  "igp": Boolean,
  "bus": String,
  "memType": String,
  "gpuChip": String,
});

const GPUs = mongoose.model('CPUs', gpuSchema);

module.exports = GPUs;
