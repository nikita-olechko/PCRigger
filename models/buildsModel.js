const mongoose = require('mongoose');

const buildsSchema = new mongoose.Schema({
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

const buildsModel = mongoose.model('pcbuilds', buildsSchema);

module.exports = buildsModel;