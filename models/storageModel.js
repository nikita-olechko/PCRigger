const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
  driveName: String,
  type: String,
  diskCapacity: Number,
  diskMark: Number,
  });

const Storage = mongoose.model('Storage', storageSchema);
module.exports = Storage;
