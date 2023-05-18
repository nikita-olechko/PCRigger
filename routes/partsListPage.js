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

/**
Performs a filtered search in the GPU collection.
@param {object} query - The search query object used to filter the GPU collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Performs a filtered search in the memory collection.
@param {object} query - The search query object used to filter the memory collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Performs a filtered search in the memory collection.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
const determineMemoryCompatibility = async function(currentBuild) {
  return new Promise((resolve, reject) => {
    motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result)
      compatibleWith = result[0].supportedRamGeneration
      resolve(compatibleWith)
    })
  })
}

/**
Performs a filtered search in the CPU collection.
@param {object} query - The search query object used to filter the CPU collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Determines the CPU compatibility of a current build.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the compatible socket or rejects with an error.
*/
const determineCpuCompatibility = async function(currentBuild) {
  return new Promise((resolve, reject) => {
    if ((currentBuild.parts.motherboard && !currentBuild.parts.cpuCooler) || (currentBuild.parts.motherboard && currentBuild.parts.cpuCooler)) {
      motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result)
        compatibleWith = result[0].socket
        resolve(compatibleWith)
      })
  } else if (currentBuild.parts.cpuCooler) {
    cpuCoolerCollection.find({name: currentBuild.parts.cpuCooler}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result)
      compatibleWith = result[0].supportedSockets
      resolve(compatibleWith)
  })
}
})}

/**
Performs a filtered search in the motherboard collection.
@param {object} query - The search query object used to filter the motherboard collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Determines the motherboard compatibility of a current build.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the compatible motherboard sizes or socket, or rejects with an error.
*/
const determineMotherboardCompatibility = async function(currentBuild) {
  return new Promise((resolve, reject) => {
    if (currentBuild.parts.case && currentBuild.parts.cpu) {
      caseCollection.find({name: currentBuild.parts.case}).toArray(function (err, caseResult) {
        if (err) throw err
        cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
          if (err) throw err
          compatibleWith = [caseResult[0].SupportedMotherboardSizes, cpuResult[0].socket]
          resolve(compatibleWith)
        })
        })
    } else if (currentBuild.parts.cpu) {
      cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
        if (err) throw err; 
        compatibleWith = cpuResult[0].socket
        resolve(compatibleWith)
      })
    } else if (currentBuild.parts.case) {
      caseCollection.find({name: currentBuild.parts.case}).toArray(function (err, caseResult) {
        if (err) throw err;
        compatibleWith = caseResult[0].SupportedMotherboardSizes
        resolve(compatibleWith)
      })
    }
  })
}

/**
Performs a filtered search in the storage collection.
@param {object} query - The search query object used to filter the storage collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Performs a filtered search in the case collection.
@param {object} query - The search query object used to filter the case collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Determines the case compatibility for a given current build.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the case compatibility or rejects with an error.
*/
const determineCaseCompatibility = async function(currentBuild) {
  return new Promise((resolve, reject) => {
    motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, result) {
      compatibleWith = result[0].formFactor
      resolve(compatibleWith)
    })
  })
}

/**
Performs a filtered search in the cpuCooler collection.
@param {object} query - The search query object used to filter the cpuCooler collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

/**
Determines the CPU cooler compatibility for a given current build.
@param {object} currentBuild - An object of a user's currentBuild..
@returns {Promise} - A Promise that resolves with the CPU cooler compatibility or rejects with an error.
*/
const determineCpuCoolerCompatibility = async function(currentBuild) {
  return new Promise((resolve, reject) => {
    if (currentBuild.parts.cpu && currentBuild.parts.motherboard) {
      cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, cpuResult) {
        if (err) throw err;
        motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, motherboardResult) {
          if (err) throw err;
          compatibleWith = [cpuResult[0].socket, motherboardResult[0].socket]
          resolve(compatibleWith)
        })
      })
    }
    else if (currentBuild.parts.cpu && !currentBuild.parts.motherboard) {
      cpuCollection.find({cpuName: currentBuild.parts.cpu}).toArray(function (err, result) {
        if (err) throw err;
        compatibleWith = [result[0].socket]
        resolve(compatibleWith)
      })
    }
    else if (currentBuild.parts.motherboard && !currentBuild.parts.cpu) {
      motherboardCollection.find({name: currentBuild.parts.motherboard}).toArray(function (err, result) {
        if (err) throw err;
        compatibleWith = [result[0].socket]
        resolve(compatibleWith)
      })
    }
  })
}

/**
Performs a filtered search in the power supply collection.
@param {object} query - The search query object used to filter the power supply collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
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

// Route handler for the parts list page
module.exports = function (app) {
  
  app.get('/parts', (req, res) => {
    res.render('partsListPage');
  });

  app.post('/parts', async (req, res) => {
  /**
  Renders the search results page with the filtered parts list.
  @param {Array} result - The array of search results.
  @param {string} partCategory - The category of the parts being searched.
  @param {number} page - The current page number.
  @param {number} totalParts - The total number of parts found.
  @param {object} query - The search query object.
  @param {object} build - Object of the users build.
 */
    const renderSearchFunction = async function(result, partCategory, page, totalParts, query, build) {
      // console.log(req.body.build)
        res.render('filteredPartsListPage', {
          parts: result,
          partCategory: partCategory,
          build: build,
          page: page,
          totalParts: totalParts,
          query: query
        })
      }

    console.log("Filter Page")
    let query
    let defaultQuery
    let totalParts
    let searchFunction
    const pageExists = req.body.page ? req.body.page : 1;
    var page = parseInt(pageExists);
    const perPage = 15;
    const skip = (page - 1) * perPage;
    searchFunction = renderSearchFunction;

    const partCategory = req.body.formId;
    // console.log(req.body.formId)
    // console.log("Passed in part type: " + partCategory);

    if (req.body.build) {
      currentBuild = JSON.parse(req.body.build)
    }

    if (req.body.query) {
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
        searchFunction(results, partCategory, page, totalParts, query , req.body.build);
      })
  
        break;

      case 'ram':
        const minimumRamSize = req.body.memSize || 2;
        const desiredGen = req.body.gen ? [req.body.gen] : ["DDR4", "DDR5"];
        defaultQuery = {capacity: { $gte: parseInt(minimumRamSize) }, gen: { $in: desiredGen }};
        if (!req.body.query && !req.body.build) {
            query = defaultQuery
          }
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.motherboard) {
            compatibility = await determineMemoryCompatibility(currentBuild)
            console.log(compatibility)
            query = {
              capacity: { $gte: parseInt(minimumRamSize) },
              gen: {$in: compatibility}, 
            }
          } if (!currentBuild.parts.motherboard) {
            query = defaultQuery
          }
          }

        memoryCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await memoryFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query, req.body.build);
        });

        break;

      case 'cpu':
        const minimumCoreCount = req.body.cores || 0;
        const maximumTdp = req.body.tdp || 500;
        defaultQuery = {cores: { $gte: parseInt(minimumCoreCount) },TDP: { $lte: parseInt(maximumTdp)}}
        if (!req.body.query && !req.body.build) {
            query = defaultQuery;
        }
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.motherboard && !currentBuild.parts.cpuCooler || currentBuild.parts.motherboard && currentBuild.parts.cpuCooler){
            compatibility = await determineCpuCompatibility(currentBuild)
            query = {cores: { $gte: parseInt(minimumCoreCount) },TDP: { $lte: parseInt(maximumTdp)}, socket: compatibility}
          } else if (currentBuild.parts.cpuCooler){
            compatibility = await determineCpuCompatibility(currentBuild)
            query = {cores: {$gte: parseInt(minimumCoreCount) },TDP: { $lte: parseInt(maximumTdp)}, socket:{$in: compatibility}}
          } else {
            query = defaultQuery
          }
        }
      cpuCollection.countDocuments(query, async function (err, count) {
        if (err) throw err;
        totalParts = count;
        results = await cpuFilteredSearch(query, skip, perPage);
        searchFunction(results, partCategory, page, totalParts, query, req.body.build)
      })
        break;

      case 'motherboards':
        const desiredFormFactor = req.body.formFactor ? [req.body.formFactor] : ["ATX", "Micro-ATX"]
        const desiredPcieGen = req.body.pcieGeneration ? [req.body.pcieGeneration] : ["PCIe 4.0", "PCIe 5.0"];
        defaultQuery = {formFactor: { $in: desiredFormFactor }, pcieGeneration: { $in: desiredPcieGen }};
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.case && currentBuild.parts.cpu) {
            compatibility = await determineMotherboardCompatibility(currentBuild)
            console.log(compatibility)
            query = {formFactor: {$in: compatibility[0]}, pcieGeneration: { $in: desiredPcieGen }, socket: compatibility[1]}
            console.log(query)
          }
            else if (currentBuild.parts.cpu && !currentBuild.parts.case) {
            compatibility = await determineMotherboardCompatibility(currentBuild)
            query = {formFactor: { $in: desiredFormFactor }, pcieGeneration: { $in: desiredPcieGen }, socket: compatibility}
          }
          else if (currentBuild.parts.case && !currentBuild.parts.cpu) {
            compatibility = await determineMotherboardCompatibility(currentBuild)
            query = {formFactor: { $in: compatibility}, pcieGeneration: { $in: desiredPcieGen }}
          } else {
            query = defaultQuery
          }
          }
        motherboardCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await motherboardFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query, req.body.build);
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
          searchFunction(results, partCategory, page, totalParts, query, req.body.build);
        });
          break;

      case 'case':
        defaultQuery = {}
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.motherboard) {
            compatibility = determineCaseCompatibility(currentBuild)
            query = {SupportedMotherboardSizes: {$in: compatibility}}
          } else {
            query = defaultQuery
          }
          }
        caseCollection.countDocuments(query, async function(err, count) {
          if (err) throw err;
          totalParts = count;
          results = await caseFilteredSearch(query, skip, perPage);
          searchFunction(results, partCategory, page, totalParts, query, req.body.build);
        });
        break;

      case 'cpucoolers':
        const desiredCoolingType = req.body.radiatorSize
        if (!req.body.query) {
          if (req.body.build) {
            if(currentBuild.parts.cpu || currentBuild.parts.motherboard) {
              compatibility = await determineCpuCoolerCompatibility(currentBuild)
              if (desiredCoolingType == "AirCooling") {query = { supportedSockets: {$all: compatibility}, radiatorSize: "Air"}}
              if (desiredCoolingType == "LiquidCooling") {query = { supportedSockets: {$all: compatibility}, radiatorSize: {$ne: "Air"}}}
              else {query = { supportedSockets: {$all: compatibility}}}
            }
          }
          if (desiredCoolingType == "AirCooling") {
            query = {radiatorSize: "Air"}
          } if (desiredCoolingType == "LiquidCooling") { 
            query = {radiatorSize: {$ne: "Air"}};
          } 
        }
      cpuCoolerCollection.countDocuments(query, async function(err, count) {
        if (err) throw err;
        totalParts = count;
        results = await cpuCoolerFilteredSearch(query, skip, perPage);
        console.log(results)
        searchFunction(results, partCategory, page, totalParts, query, req.body.build);
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
        searchFunction(results, partCategory, page, totalParts, query, req.body.build);
      })
        break;

      default:
        console.log("Error getting page");
        break;
    }
  })
}