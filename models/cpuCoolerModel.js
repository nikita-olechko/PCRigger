const mongoose = require('mongoose');

const cpuCoolerSchema = new mongoose.Schema({
    "coolerName": String,
  "brand": String,
  "supportedSockets": [String],
  "height": Number,
  "powerDraw": Number,
  "fanSize": Number,
  "radiatorSize": String,
});

const CPUcoolers = mongoose.model('CPUcoolers', cpuCoolerSchema);
module.exports = CPUcoolers;