const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
    partName: String,
    type: String,
    diskCapacity:float,
  });

const Storage = mongoose.model('Storage', storageSchema);
module.exports = Storage;
