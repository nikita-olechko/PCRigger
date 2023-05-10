const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    Manufacturer: String,
    Model: String,
    SupportedMotherboardSizes: [String],
    Dimensions: String,
    Material: String,
    DriveBays: String,
    Ports: [String],
    FanSupport: String,
});

const Cases = mongoose.model('Cases', caseSchema);
module.exports = Cases;
