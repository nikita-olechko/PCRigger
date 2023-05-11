const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    class: String,
    name: String,
    parts: [{
        cpu: String,
        gpu: String,
        ram: [String],
        motherboard: String,
        cpuCooler: String,
        storage: [String],
        case: String,
        powerSupply: String,
    }]
});

const Cases = mongoose.model('Cases', caseSchema);
module.exports = Cases;