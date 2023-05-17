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
    // console.log("Passed in part type: " + partCategory);

    const withBuild = async function(result, partCategory, page, totalParts) {
    // console.log(req.body.build)
      res.render('partsListPage', {
        parts: result,
        partCategory: partCategory,
        build: req.body.build,
        page: page,
        totalParts: totalParts
      })
    }
  
    const withoutBuild = async function(result, partCategory, page, totalParts) {
      res.render('partsListPage', {
        parts: result,
        partCategory: partCategory,
        build: null,
        page: page,
        totalParts: totalParts
      })
    }

    switch (partCategory) {

      case 'gpu':  
      gpuCollection.countDocuments({}, function(err, count) {
        if (err) throw err;
        totalParts = count;        
        gpuCollection.find({}).skip(skip).limit(perPage).sort({releaseYear: -1}).toArray(function (err, result) {
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
          if (req.body.build) {
            currentBuild = JSON.parse(req.body.build)
            if (currentBuild.parts.motherboard) {
              motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, result) {
                if (err) throw err;
                memoryCollection.find({gen: result[0].supportedRamGeneration[0]}).skip(skip).limit(perPage).sort({latency: 1}).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
                })})
              // } else if { placeholder for filerting by CPU compatibility as well
              } else {
                memoryCollection.find({}).skip(skip).limit(perPage).sort({latency: 1}).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts);
                })}
            } else {
              memoryCollection.find({}).skip(skip).limit(perPage).sort({latency: 1}).toArray(function (err, result) {
                if (err) throw err;
                withoutBuild(result, partCategory, page, totalParts);
            });
            }
            });
        break;

      case 'cpu':
        cpuCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;
          if (req.body.build) {
            currentBuild = JSON.parse(req.body.build)
            if (currentBuild.parts.motherboard && currentBuild.parts.cpuCooler) {
              motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, moboResult) {
                if (err) throw err;
                cpuCoolerCollection.find({name: currentBuild.parts.cpuCooler}).sort({cpuMark: -1}).toArray(function (err, coolerResult) {
                  if (err) throw err;
                  cpuCollection.find({
                    $and: [
                      { socket: moboResult[0].socket },
                      { socket: { $in: coolerResult[0].supportedSockets } }
                    ]
                  }).skip(skip).limit(perPage).toArray(function (err, result) {
                    if (err) throw err;
                    withBuild(result, partCategory, page, totalParts)
                })
            })})
            } else if (currentBuild.parts.motherboard){
              motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, moboResult) {
                if (err) throw err;
                cpuCollection.find({socket: moboResult[0].socket}).skip(skip).limit(perPage).sort({cpuMark: -1}).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else if (currentBuild.parts.cpuCooler){
              cpuCoolerCollection.find({name: currentBuild.parts.cpuCooler}).toArray(function (err, coolerResult) {
                if (err) throw err;
                cpuCollection.find({socket: { $in: coolerResult[0].supportedSockets }}).skip(skip).limit(perPage).sort({cpuMark: -1}).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else {
              cpuCollection.find({}).skip(skip).limit(perPage).sort({cpuMark: -1}).toArray(function (err, result) {
                if (err) throw err;
                withBuild(result, partCategory, page, totalParts);
              })}
          } else {
            cpuCollection.find({}).skip(skip).limit(perPage).sort({cpuMark: -1}).toArray(function (err, result) {
              if (err) throw err;
              withoutBuild(result, partCategory, page, totalParts);
          });
          }
          });
        break;

      case 'motherboards':
        motherboardCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;
          if (req.body.build) {
            currentBuild = JSON.parse(req.body.build)
            if (currentBuild.parts.case && currentBuild.parts.cpu) {
              caseCollection.find({name: currentBuild.parts.case}).toArray(function (err, caseResult) {
                if (err) throw err;
                cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
                  if (err) throw err;
                  motherboardCollection.find({formFactor: {$in: caseResult[0].SupportedMotherboardSizes}, socket: cpuResult[0].socket }).skip(skip).limit(perPage).toArray(function (err, result) {
                    if (err) throw err;
                    withBuild(result, partCategory, page, totalParts)
                })
            })})
            } else if (currentBuild.parts.cpu){
              cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
                if (err) throw err;
                motherboardCollection.find({socket: cpuResult[0].socket}).skip(skip).limit(perPage).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else if (currentBuild.parts.case){
              caseCollection.find({name: currentBuild.parts.case}).toArray(function (err, caseResult) {
                if (err) throw err;
                motherboardCollection.find({formFactor: { $in: caseResult[0].SupportedMotherboardSizes }}).skip(skip).limit(perPage).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else {
              motherboardCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
                if (err) throw err;
                withBuild(result, partCategory, page, totalParts);
              })}
          } else {
            motherboardCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
              if (err) throw err;
              withoutBuild(result, partCategory, page, totalParts);
          });
          }
          });
        break;

      case 'storage':
        storageCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;        
          storageCollection.find({}).skip(skip).limit(perPage).sort({diskMark: -1}).toArray(function (err, result) {
            if (err) throw err;
            if (req.body.build) {
              withBuild(result, partCategory, page, totalParts);
            } else {
              withoutBuild(result, partCategory, page, totalParts);
          };
          })
        });
        break;

      case 'case':
        caseCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;
          if (req.body.build) {
            currentBuild = JSON.parse(req.body.build)
            if (currentBuild.parts.motherboard) {
              motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, result) {
                if (err) throw err;
                caseCollection.find({SupportedMotherboardSizes: { $in: [result[0].formFactor] }}).skip(skip).limit(perPage).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else {
              caseCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
                if (err) throw err;
                withBuild(result, partCategory, page, totalParts);
              })}
          } else {
            caseCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
              if (err) throw err;
              withoutBuild(result, partCategory, page, totalParts);
          });
          }
          });
        break;

      case 'cpucoolers':
        cpuCoolerCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;
          if (req.body.build) {
            currentBuild = JSON.parse(req.body.build)
            if (currentBuild.parts.cpu && currentBuild.parts.motherboard) {
              cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
                if (err) throw err;
                motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, moboResult) {
                  if (err) throw err;
                  console.log(cpuResult[0].socket, moboResult[0].socket)
                  cpuCoolerCollection.find({supportedSockets: {$all: [cpuResult[0].socket, moboResult[0].socket]}}).skip(skip).limit(perPage).toArray(function (err, result) {
                    if (err) throw err;
                    withBuild(result, partCategory, page, totalParts)
                })
            })})
            } else if (currentBuild.parts.cpu){
              cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
                if (err) throw err;
                cpuCoolerCollection.find({supportedSockets: cpuResult[0].socket}).skip(skip).limit(perPage).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else if (currentBuild.parts.motherboard){
              motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, moboResult) {
                if (err) throw err;
                cpuCoolerCollection.find({supportedSockets: moboResult[0].socket}).skip(skip).limit(perPage).toArray(function (err, result) {
                  if (err) throw err;
                  withBuild(result, partCategory, page, totalParts)
            })})
            } else {
              cpuCoolerCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
                if (err) throw err;
                withBuild(result, partCategory, page, totalParts);
              })}
          } else {        
          cpuCoolerCollection.find({}).skip(skip).limit(perPage).toArray(function (err, result) {
            if (err) throw err;
            if (req.body.build) {
              withBuild(result, partCategory, page, totalParts);
            } else {
              withoutBuild(result, partCategory, page, totalParts);
          };
          })
        }});
        break;

      case 'powersupplies':
        powerSupplyCollection.countDocuments({}, function(err, count) {
          if (err) throw err;
          totalParts = count;        
          powerSupplyCollection.find({}).skip(skip).limit(perPage).sort({ powerOutput: -1 }).toArray(function (err, result) {
            if (err) throw err;
            if (req.body.build) {
              withBuild(result, partCategory, page, totalParts);
            } else {
              withoutBuild(result, partCategory, page, totalParts);
          };
          })
        });
        break;

      default:
        console.log("Error getting page");
        break;
    }
  })

  app.get('/parts', (req, res) => {
    res.render('partsListPage');
  });


  app.post('/filterParts', async (req, res) => {
    console.log("Filter Page")
    let searchFunction
    const pageExists = req.body.page ? req.body.page : 1;
    var page = parseInt(pageExists);
    const perPage = 15;
    const skip = (page - 1) * perPage;

    const partCategory = req.body.formId;
    console.log(req.body.formId)
    // console.log("Passed in part type: " + partCategory);

    const withBuild = async function(result, partCategory, page, totalParts) {
    // console.log(req.body.build)
      res.render('partsListPage', {
        parts: result,
        partCategory: partCategory,
        build: req.body.build,
        page: page,
        totalParts: totalParts
      })
    }
  
    const withoutBuild = async function(result, partCategory, page, totalParts) {
      res.render('partsListPage', {
        parts: result,
        partCategory: partCategory,
        build: null,
        page: page,
        totalParts: totalParts
      })
    }

    const gpuFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        gpuCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort({})
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    if (req.body.build) {
      console.log("there is a build")
      currentBuild = JSON.parse(req.body.build)
      searchFunction = withBuild
    } else {
      searchFunction = withoutBuild
    }

    switch (partCategory) {
      case 'gpu':
        let query
        const minimumMemorySize = req.body.memSize || 0;

        if (req.body.bus) {
          query = {
            memSize: { $gte: parseInt(minimumMemorySize) },
            bus: req.body.bus}
        } else {
          query ={
            memSize: { $gte: parseInt(minimumMemorySize) }
          }
        }
        console.log(query)

      gpuCollection.countDocuments(query, async function(err, count) {
        if (err) throw err;
        totalParts = count;  
        console.log(count)      
        results = await gpuFilteredSearch(query, skip, perPage)
        console.log(partCategory, page, totalParts, results.length)
        searchFunction(results, partCategory, page, totalParts);
      })
  
        break;

      case 'ram':
        break;

      case 'cpu':
        break;

      case 'motherboards':
        break;

      case 'storage':
        break;

      case 'case':
        break;

      case 'cpucoolers':
        break;

      case 'powersupplies':
        break;

      default:
        console.log("Error getting page");
        break;
    }
  })
}