const mongoose = require('mongoose');

const motherboardSchema = new mongoose.Schema({
    motherboardName: String,
    brand: String,
    manufacturer: String,
    socket: String,
    supportedRamGeneration: [String],
    formFactor: String,
    ports: [String],
    pcieGeneration: String,
});

const Motherboards = mongoose.model('Motherboards', motherboardSchema);
module.exports = Motherboards;