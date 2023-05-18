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
    let totalParts

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
    let query
    let totalParts
    let searchFunction
    const pageExists = req.body.page ? req.body.page : 1;
    var page = parseInt(pageExists);
    const perPage = 15;
    const skip = (page - 1) * perPage;

    const partCategory = req.body.formId;
    // console.log(req.body.formId)
    // console.log("Passed in part type: " + partCategory);

    const withBuild = async function(result, partCategory, page, totalParts, query) {
    // console.log(req.body.build)
      res.render('filteredPartsListPage', {
        parts: result,
        partCategory: partCategory,
        build: req.body.build,
        page: page,
        totalParts: totalParts,
        query: query
      })
    }
  
    const withoutBuild = async function(result, partCategory, page, totalParts, query) {
      res.render('filteredPartsListPage', {
        parts: result,
        partCategory: partCategory,
        build: null,
        page: page,
        totalParts: totalParts,
        query: query
      })
    }

    const gpuFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        gpuCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort({releaseYear: -1})
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    const memoryFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        memoryCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort({latency: 1})
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    const cpuFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        cpuCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort({cpuMark: -1})
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    const motherboardFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        motherboardCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort()
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    
    const storageFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        storageCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort({diskMark: -1})
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    const caseFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        caseCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort()
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    const cpuCoolerFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        cpuCoolerCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort()
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    const powerSupplyFilteredSearch = function (query, skip, perpage) {
      return new Promise((resolve, reject) => {
        powerSupplyCollection.find(query)
          .skip(skip)
          .limit(perpage)
          .sort({ powerOutput: -1 })
          .toArray(function (err, result) {
            if (err) reject(err);
            resolve(result);
          });
      });
    };

    if (req.body.build) {
      // console.log("there is a build")
      currentBuild = JSON.parse(req.body.build)
      searchFunction = withBuild
    } else {
      searchFunction = withoutBuild
    }

    if (req.body.query) {
      // console.log("query exists")
      query = JSON.parse(req.body.query)
    } 

    switch (partCategory) {
      case 'gpu':
        const minimumMemorySize = req.body.memSize || 0;
        const desiredManufacturer = req.body.manufacturer ? [req.body.manufacturer] : ["AMD", "NVIDIA"];
        if (!req.body.query) {
          if (req.body.bus) {query = {
            memSize: { $gte: parseInt(minimumMemorySize) },
            bus: req.body.bus,
            manufacturer: {$in: desiredManufacturer}}
        } else {
          query = {
            memSize: { $gte: parseInt(minimumMemorySize) },
            manufacturer: {$in: desiredManufacturer}
          }
        }
        }
      gpuCollection.countDocuments(query, async function(err, count) {
        if (err) throw err;
        totalParts = count;     
        results = await gpuFilteredSearch(query, skip, perPage)
        searchFunction(results, partCategory, page, totalParts, query);
      })
  
        break;

      case 'ram':
        const minimumRamSize = req.body.capacity || 0;
        const desiredGen = req.body.gen ? [req.body.gen] : ["DDR4", "DDR5"];
        if (!req.body.query) {
            query = {
              capacity: { $gte: parseInt(minimumRamSize) },
              gen: { $in: desiredGen },
            };
          }
        memoryCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await memoryFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query);
        });

        break;

      case 'cpu':
        const minimumCoreCount = req.body.cores || 0;
        const maximumTdp = req.body.tdp || 500;
        if (!req.body.query) {
          if (req.body.bus) {
            query = {
              cores: { $gte: parseInt(minimumCoreCount) },
              TDP: { $lte: parseInt(maximumTdp)}
            };
          } else {
            query = {
              cores: { $gte: parseInt(minimumCoreCount) },
              TDP: { $lte: parseInt(maximumTdp)}
            };
          }
        }
      cpuCollection.countDocuments(query, async function (err, count) {
        if (err) throw err;
        totalParts = count;
        results = await cpuFilteredSearch(query, skip, perPage);
        searchFunction(results, partCategory, page, totalParts, query)
      })
        break;

      case 'motherboards':
        const desiredFormFactor = req.body.formFactor ? [req.body.formFactor] : ["ATX", "Micro-ATX"]
        const desiredPcieGen = req.body.pcieGeneration ? [req.body.pcieGeneration] : ["PCIe 4.0", "PCIe 5.0"];
        if (!req.body.query) {
            query = {
              formFactor: { $in: desiredFormFactor },
              pcieGeneration: { $in: desiredPcieGen },
            };
          }
        motherboardCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await motherboardFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query);
        });
        break;

      case 'storage':
        const desiredCapacity = req.body.diskCapacity || 0;
        if (!req.body.query) {
            query = {
              diskCapacity: { $gte: parseInt(desiredCapacity) },
            };
          }
        storageCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await storageFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query);
        });
        break;

      case 'case':
        if (!req.body.query) {
            query = {
            };
          }
        caseCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await caseFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query);
        });
        break;

      case 'cpucoolers':
        const desiredCoolingType = req.body.radiatorSize
        if (!req.body.query) {
          if (desiredCoolingType == "AirCooling") {
            query = {radiatorSize: "Air"}
          } if (desiredCoolingType == "LiquidCooling") { 
            query = {
              radiatorSize: {$ne: "Air"},
            };
          } 
        }
      cpuCoolerCollection.countDocuments(query, async function(err, count) {
        if (err) throw err;
        totalParts = count;
        results = await cpuCoolerFilteredSearch(query, skip, perPage);
        console.log(results)
        searchFunction(results, partCategory, page, totalParts, query);
      });
        break;

      case 'powersupplies':
        const minPowerOutput = req.body.powerOutput || 0;
        const desiredRating = req.body.rating ? [req.body.rating] : ["Gold", "Platinum", "Titanium"];
        if (!req.body.query) {
          {query = {
            powerOutput: { $gte: parseInt(minPowerOutput) },
            rating: {$in: desiredRating},
        }}
      }
      powerSupplyCollection.countDocuments(query, async function(err, count) {
        if (err) throw err;
        totalParts = count;     
        results = await powerSupplyFilteredSearch(query, skip, perPage)
        searchFunction(results, partCategory, page, totalParts, query);
      })
        break;

      default:
        console.log("Error getting page");
        break;
    }
  })
}