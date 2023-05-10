//Boilerplate requirements for the parts list page
const express = require('express');
const mongoose = require('mongoose');
router = express.Router;
const cpuModel = require('../models/cpuModel');
const memoryModel = require('../models/memoryModel');
const gpuModel = require('../models/gpuModel');
const storageModel = require('../models/storageModel');
const utils = require('../utils');


/// Constants and global variables
/* secret information section */

const mongodb_database = process.env.MONGODB_DATABASE;



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

    var partType = req.query.partType.toLowerCase();

    switch (partType) {
      // give me a switch case for each part type and then render the page with the correct part type depending on the 
      // string variable passed in from the url
      // if the url is /parts/cpu then render the page with the cpu parts
      case 'cpu':
        cpuCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          res.render('partsListPage', {
            parts: result,
            partType: partType
          });
        });

        break;
      case 'memory':
        memoryCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          res.render('partsListPage', {
            parts: result,
            partType: partType
          });
        });
        break;
      case 'gpu':
        gpuCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          res.render('partsListPage', {
            parts: result,
            partType: partType
          });
        });
        break;
      // case 'motherboard':
      //   motherboardCollection.find({}).toArray(function (err, result) {
      //     if (err) throw err;
      //     res.render('partsListPage', {
      //       parts: result,
      //       partType: partType
      //     });
      //   });
      //   break;
      case 'storage':
        storageCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          res.render('partsListPage', {
            parts: result,
            partType: partType
          });
        });
        break;

      default:
        res.render('partsListPage');
        break;
    }


    res.render('partsListPage');
  })
}