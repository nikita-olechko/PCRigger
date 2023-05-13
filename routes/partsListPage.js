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

// Parts collections
const memoryCollection = database.db(mongodb_database).collection('Memory');
const cpuCollection = database.db(mongodb_database).collection('CpuSpecs');
const gpuCollection = database.db(mongodb_database).collection('GpuSpecs');
const storageCollection = database.db(mongodb_database).collection('Storage');
const motherboardCollection = database.db(mongodb_database).collection('Motherboards');
const powerSupplyCollection = database.db(mongodb_database).collection('Powersupplies');
// const ramCollection = database.db(mongodb_database).collection('Ram');
const caseCollection = database.db(mongodb_database).collection('Cases');
const cpuCoolerCollection = database.db(mongodb_database).collection('CpuCoolers');


// Route handler for the parts list page
module.exports = function (app) {

  app.post('/parts', async (req, res) => {
    const pageExists = req.body.page ? req.body.page : 1;
    var page = parseInt(pageExists);
    const perPage = 15;
    const skip = (page - 1) * perPage;

    const partCategory = req.body.formId;
    console.log("Passed in part type: " + partCategory);

    const withBuild = function(result, partCategory, page, totalParts) {
      console.log(req.body.build)
      res.render('partsListPage', {
        parts: result,
        partCategory: partCategory,
        build: req.body.build,
        page: page,
        totalParts: totalParts
      })
    }
  
    const withoutBuild = function(result, partCategory, page, totalParts) {
      res.render('partsListPage', {
        parts: result,
        partCategory: partCategory,
        build: null,
        page: page,
        totalParts: totalParts
      })
    }

    // const result = await cpuModel.find({});
    // console.log(result);

    switch (partCategory) {
      // give me a switch case for each part type and then render the page with the correct part type depending on the 
      // string variable passed in from the url
      // if the url is /parts/cpu then render the page with the cpu parts

      case 'gpu':  
      gpuCollection.countDocuments({}, function(err, count) {
        if (err) throw err;
        totalParts = count;        
        gpuCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            withBuild(result, partCategory, page, totalParts);
          } else {
            withoutBuild(result, partCategory, page, totalParts);
          }
        })
        })
      ;

        break;

      case 'ram':
        memoryCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;        
          memoryCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
            if (err) throw err;
            if (req.body.build) {
              withBuild(result, partCategory, page, totalParts);
            } else {
              withoutBuild(result, partCategory, page, totalParts);
          };
          })
        });
        break;

      case 'cpu':
        cpuCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            console.log(req.body.build)
            res.render('partsListPage', {
              parts: result,
              partCategory: partCategory,
              build: req.body.build
            })
          } else {
          res.render('partsListPage', {
            parts: result,
            partCategory: partCategory,
            build: null
          })
        };
        });
        break;

      case 'motherboards':
        motherboardCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            console.log(req.body.build)
            res.render('partsListPage', {
              parts: result,
              partCategory: partCategory,
              build: req.body.build
            })
          } else {
          res.render('partsListPage', {
            parts: result,
            partCategory: partCategory,
            build: null
          })
        };
        });
        break;

      case 'storage':
        storageCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            console.log(req.body.build)
            res.render('partsListPage', {
              parts: result,
              partCategory: partCategory,
              build: req.body.build
            })
          } else {
          res.render('partsListPage', {
            parts: result,
            partCategory: partCategory,
            build: null
          })
        };
        });
        break;

      case 'case':
        caseCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            console.log(req.body.build)
            res.render('partsListPage', {
              parts: result,
              partCategory: partCategory,
              build: req.body.build
            })
          } else {
          res.render('partsListPage', {
            parts: result,
            partCategory: partCategory,
            build: null
          })
        };
        });
        break;

      case 'cpucoolers':
        cpuCoolerCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            console.log(req.body.build)
            res.render('partsListPage', {
              parts: result,
              partCategory: partCategory,
              build: req.body.build
            })
          } else {
          res.render('partsListPage', {
            parts: result,
            partCategory: partCategory,
            build: null
          })
        };
        });
        break;

      case 'powersupplies':
        powerSupplyCollection.find({}).toArray(function (err, result) {
          if (err) throw err;
          if (req.body.build) {
            console.log(req.body.build)
            res.render('partsListPage', {
              parts: result,
              partCategory: partCategory,
              build: req.body.build
            })
          } else {
          res.render('partsListPage', {
            parts: result,
            partCategory: partCategory,
            build: null
          })
        };
        });
        break;

// GPU is yet to be added, CPU should use cpuspecs collection, GPU shuld use the gouspecs collection

      default:
        console.log("Error getting page");
        break;
    }
  })

  app.get('/parts', (req, res) => {
    res.render('partsListPage');
  });
}