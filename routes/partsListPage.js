//Boilerplate requirements for the parts list page
const express = require('express');
const mongoose = require('mongoose');
router = express.Router;
const cpuModel = require('../models/cpuModel');
const memoryModel = require('../models/memoryModel');
const gpuModel = require('../models/gpuModel');
const motherboardModel = require('../models/motherboardModel');
const utils = require('../utils');


/// Constants and global variables
var {
  database
} = include('databaseConnection');

const memoryCollection = database.db(mongodb_database).collection('Memory');
const cpuCollection = database.db(mongodb_database).collection('CpuSpecs');
const gpuCollection = database.db(mongodb_database).collection('GpuSpecs');
const motherboardCollection = database.db(mongodb_database).collection('Motherboards');


// Route handler for the parts list page
module.exports = function (app) {
  app.get('/parts', (req, res) => {

    // TODO: After making the schemas and models,
    // create function that iterates through the models of parts and returns a card for each part


    res.render('partsListPage');
  })
}