// Boilerplate requirements for the parts list page
const express = require('express');
router = express.Router();

/// Constants and global variables
/* secret information section */

const mongodb_database = process.env.MONGODB_DATABASE;

var { database } = include('databaseConnection');

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
 * Performs a filtered search in the GPU collection.
 * @param {object} query - The search query object used to filter the GPU collection.
 * @param {number} skip - The number of documents to skip in the search results.
 * @param {number} perpage - The maximum number of documents to return per page.
 * @returns {Promise} - A Promise that resolves with the search results or rejects with an error.
 */
const gpuFilteredSearch = function (query, skip, perpage) {
  return new Promise((resolve) => {
    gpuCollection
      .find(query)
      .skip(skip)
      .limit(perpage)
      .sort({ releaseYear: -1 })
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

/**
 * Performs a filtered search in the memory collection.
 * @param {object} query - The search query object used to filter the memory collection.
 * @param {number} skip - The number of documents to skip in the search results.
 * @param {number} perpage - The maximum number of documents to return per page.
 * @returns {Promise} - A Promise that resolves with the search results or rejects with an error.
 */
const memoryFilteredSearch = function (query, skip, perpage) {
  return new Promise((resolve) => {
    memoryCollection
      .find(query)
      .skip(skip)
      .limit(perpage)
      .sort({ latency: 1 })
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

/**
 * Performs a filtered search in the memory collection.
 * @param {object} currentBuild - An object of a user's currentBuild.
 * @returns {Promise} - A Promise that resolves with the search results or rejects with an error.
 */
const determineMemoryCompatibility = async function (currentBuild) {
  return new Promise((resolve) => {
    motherboardCollection.find({ name: currentBuild.parts.motherboard }).toArray(function (err, result) {
      if (err) {
        res.render('errorPage');
      } else {
        console.log(result);
        compatibleWith = result[0].supportedRamGeneration;
        resolve(compatibleWith);
      }
    });
  });
};


/**
Performs a filtered search in the CPU collection.
@param {object} query - The search query object used to filter the CPU collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
const cpuFilteredSearch = function (query, skip, perpage) {
  return new Promise((resolve) => {
    cpuCollection.find(query)
      .skip(skip)
      .limit(perpage)
      .sort({ cpuMark: -1 })
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

/**
Determines the CPU compatibility of a current build.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the compatible socket or rejects with an error.
*/
const determineCpuCompatibility = async function (currentBuild) {
  return new Promise((resolve) => {
    if ((currentBuild.parts.motherboard && !currentBuild.parts.cpuCooler) || (currentBuild.parts.motherboard && currentBuild.parts.cpuCooler)) {
      motherboardCollection.find({ name: currentBuild.parts.motherboard }).toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          console.log(result);
          compatibleWith = result[0].socket;
          resolve(compatibleWith);
        }
      });
    } else if (currentBuild.parts.cpuCooler) {
      cpuCoolerCollection.find({ name: currentBuild.parts.cpuCooler }).toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          console.log(result);
          compatibleWith = result[0].supportedSockets;
          resolve(compatibleWith);
        }
      });
    }
  });
};

/**
Performs a filtered search in the motherboard collection.
@param {object} query - The search query object used to filter the motherboard collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
const motherboardFilteredSearch = function (query, skip, perpage) {
  return new Promise((resolve) => {
    motherboardCollection.find(query)
      .skip(skip)
      .limit(perpage)
      .sort()
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

/**
Determines the motherboard compatibility of a current build.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the compatible motherboard sizes or socket, or rejects with an error.
*/
const determineMotherboardCompatibility = async function (currentBuild) {
  return new Promise((resolve) => {
    if (currentBuild.parts.case && currentBuild.parts.cpu) {
      caseCollection.find({ name: currentBuild.parts.case }).toArray(function (err, caseResult) {
        if (err) throw err;
        cpuCollection.find({ cpuName: currentBuild.parts.cpu }).toArray(function (err, cpuResult) {
          if (err) {
            res.render('errorPage');
          } else {
            compatibleWith = [caseResult[0].SupportedMotherboardSizes, cpuResult[0].socket];
            resolve(compatibleWith);
          }
        });
      });
    } else if (currentBuild.parts.cpu) {
      cpuCollection.find({ cpuName: currentBuild.parts.cpu }).toArray(function (err, cpuResult) {
        if (err) {
          res.render('errorPage');
        } else {
          compatibleWith = cpuResult[0].socket;
          resolve(compatibleWith);
        }
      });
    } else if (currentBuild.parts.case) {
      caseCollection.find({ name: currentBuild.parts.case }).toArray(function (err, caseResult) {
        if (err) {
          res.render('errorPage');
        } else {
          compatibleWith = caseResult[0].SupportedMotherboardSizes;
          resolve(compatibleWith);
        }
      });
    }
  });
};

/**
Performs a filtered search in the storage collection.
@param {object} query - The search query object used to filter the storage collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
const storageFilteredSearch = function (query, skip, perpage) {
  return new Promise((resolve) => {
    storageCollection.find(query)
      .skip(skip)
      .limit(perpage)
      .sort({ diskMark: -1 })
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
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
  return new Promise((resolve) => {
    caseCollection.find(query)
      .skip(skip)
      .limit(perpage)
      .sort()
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

/**
Determines the case compatibility for a given current build.
@param {object} currentBuild - An object of a user's currentBuild.
@returns {Promise} - A Promise that resolves with the case compatibility or rejects with an error.
*/
const determineCaseCompatibility = async function (currentBuild) {
  return new Promise((resolve) => {
    motherboardCollection.find({ name: currentBuild.parts.motherboard }).toArray(function (err, result) {
      if (err) {
        res.render('errorPage');
      } else {
        compatibleWith = result[0].formFactor;
        resolve(compatibleWith);

      }
    });
  });
};

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
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

/**
Determines the CPU cooler compatibility for a given current build.
@param {object} currentBuild - An object of a user's currentBuild..
@returns {Promise} - A Promise that resolves with the CPU cooler compatibility or rejects with an error.
*/
const determineCpuCoolerCompatibility = async function (currentBuild) {
  return new Promise((resolve) => {
    if (currentBuild.parts.cpu && currentBuild.parts.motherboard) {
      cpuCollection.find({ cpuName: currentBuild.parts.cpu }).toArray(function (err, cpuResult) {
        if (err) throw err;
        motherboardCollection.find({ name: currentBuild.parts.motherboard }).toArray(function (err, motherboardResult) {
          if (err) {
            res.render('errorPage');
          } else {
            compatibleWith = [cpuResult[0].socket, motherboardResult[0].socket];
            resolve(compatibleWith);
          }
        });
      });
    }
    else if (currentBuild.parts.cpu && !currentBuild.parts.motherboard) {
      cpuCollection.find({ cpuName: currentBuild.parts.cpu }).toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          compatibleWith = [result[0].socket];
          resolve(compatibleWith);
        }
      });
    }
    else if (currentBuild.parts.motherboard && !currentBuild.parts.cpu) {
      motherboardCollection.find({ name: currentBuild.parts.motherboard }).toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          compatibleWith = [result[0].socket];
          resolve(compatibleWith);
        }
      });
    }
  });
};

/**
Performs a filtered search in the power supply collection.
@param {object} query - The search query object used to filter the power supply collection.
@param {number} skip - The number of documents to skip in the search results.
@param {number} perpage - The maximum number of documents to return per page.
@returns {Promise} - A Promise that resolves with the search results or rejects with an error.
*/
const powerSupplyFilteredSearch = function (query, skip, perpage) {
  return new Promise((resolve) => {
    powerSupplyCollection.find(query)
      .skip(skip)
      .limit(perpage)
      .sort({ powerOutput: -1 })
      .toArray(function (err, result) {
        if (err) {
          res.render('errorPage');
        } else {
          resolve(result);
        }
      });
  });
};

// Route handler for the parts list page
module.exports = function (app) {

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
    const renderSearchFunction = async function (result, partCategory, page, totalParts, query, build) {
      res.render('filteredPartsListPage', {
        parts: result,
        partCategory: partCategory,
        build: build,
        page: page,
        totalParts: totalParts,
        query: query
      });
    };

    console.log("Filter Page");
    let query;
    let defaultQuery;
    let totalParts;
    let searchFunction;
    const pageExists = req.body.page ? req.body.page : 1;
    var page = parseInt(pageExists);
    const perPage = 15;
    const skip = (page - 1) * perPage;
    searchFunction = renderSearchFunction;

    const partCategory = req.body.formId;
    console.log(req.body.formId);

    if (req.body.build) {
      currentBuild = JSON.parse(req.body.build);
      currentBuildToPass = req.body.build;
    } else {
      currentBuildToPass = null;
    }

    if (req.body.query) {
      query = JSON.parse(req.body.query);
    }

    switch (partCategory) {
      case 'gpu':
        // If a filter for VRAM has been selected, use it, otherwise default to 0
        // If a filter for preferred manufacturer has been selected, use it, otherwise default to all available options
        const minimumMemorySize = req.body.memSize || 0;
        const desiredManufacturer = req.body.manufacturer ? [req.body.manufacturer] : ["AMD", "NVIDIA"];
        if (!req.body.query) {
          if (req.body.bus) {
            query = {
              memSize: { $gte: parseInt(minimumMemorySize) },
              bus: req.body.bus,
              manufacturer: { $in: desiredManufacturer }
            };
          } else {
            query = {
              memSize: { $gte: parseInt(minimumMemorySize) },
              manufacturer: { $in: desiredManufacturer }
            };
          }
        }
        // Count the numer of gpus that match the query
        gpuCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await gpuFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });

        break;

      case 'ram':
        // If a filter for memory size is selected, use it, otherwise default to 2
        // If a filter for desired memory generation is selected, use it, otherwise default to all available options
        const minimumRamSize = req.body.memSize || 2;
        const desiredGen = req.body.gen ? [req.body.gen] : ["DDR4", "DDR5"];
        // Select the appropriate query based on the filters selected/build data
        defaultQuery = { capacity: { $gte: parseInt(minimumRamSize) }, gen: { $in: desiredGen } };
        if (!req.body.query && !req.body.build) {
          query = defaultQuery;
        }
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.motherboard) {
            compatibility = await determineMemoryCompatibility(currentBuild);

            query = {
              capacity: { $gte: parseInt(minimumRamSize) },
              gen: { $in: compatibility },
            };
          } if (!currentBuild.parts.motherboard) {
            query = defaultQuery;
          }
        }
        // Count the number of ram modules that match the query
        memoryCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await memoryFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });

        break;

      case 'cpu':
        // If a filter for cores has been selected, use it, otherwise default to 0
        const minimumCoreCount = req.body.cores || 0;
        // If a filter for TDP has been selected, use it, otherwise default to 500
        const maximumTdp = req.body.tdp || 500;
        // Select the appropriate query based on the filters selected/build data
        defaultQuery = { cores: { $gte: parseInt(minimumCoreCount) }, TDP: { $lte: parseInt(maximumTdp) } };
        if (!req.body.query && !req.body.build) {
          query = defaultQuery;
        }
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.motherboard && !currentBuild.parts.cpuCooler || currentBuild.parts.motherboard && currentBuild.parts.cpuCooler) {
            const compatibility = await determineCpuCompatibility(currentBuild);
            const query = { cores: { $gte: parseInt(minimumCoreCount) }, TDP: { $lte: parseInt(maximumTdp) }, socket: compatibility };
          } else if (currentBuild.parts.cpuCooler) {
            compatibility = await determineCpuCompatibility(currentBuild);
            const query = { cores: { $gte: parseInt(minimumCoreCount) }, TDP: { $lte: parseInt(maximumTdp) }, socket: { $in: compatibility } };
          } else {
            const query = defaultQuery;
          }
        }
        // Count the number of cpus that match the query
        cpuCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await cpuFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });
        break;

      case 'motherboards':
        // If a filter for form factor has been selected, use it, otherwise default to both ATX and Micro-ATX
        const desiredFormFactor = req.body.formFactor ? [req.body.formFactor] : ["ATX", "Micro-ATX"];
        // If a filter for PCIe generation has been selected, use it, otherwise default to both PCIe 4.0 and PCIe 5.0
        const desiredPcieGen = req.body.pcieGeneration ? [req.body.pcieGeneration] : ["PCIe 4.0", "PCIe 5.0"];
        // Select the appropriate query based on the filters selected/build data
        defaultQuery = { formFactor: { $in: desiredFormFactor }, pcieGeneration: { $in: desiredPcieGen } }
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.case && currentBuild.parts.cpu) {
            compatibility = await determineMotherboardCompatibility(currentBuild);
            query = { formFactor: { $in: compatibility[0] }, pcieGeneration: { $in: desiredPcieGen }, socket: compatibility[1] };
          }
          else if (currentBuild.parts.cpu && !currentBuild.parts.case) {
            compatibility = await determineMotherboardCompatibility(currentBuild);
            query = { formFactor: { $in: desiredFormFactor }, pcieGeneration: { $in: desiredPcieGen }, socket: compatibility };
          }
          else if (currentBuild.parts.case && !currentBuild.parts.cpu) {
            compatibility = await determineMotherboardCompatibility(currentBuild);
            query = { formFactor: { $in: compatibility }, pcieGeneration: { $in: desiredPcieGen } };
          } else {
            query = defaultQuery;
          }
        } else {
          query = defaultQuery;
        }
        // Count the number of motherboards that match the query
        motherboardCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await motherboardFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });
        break;

      case 'storage':
        // If a filter for storage capacity has been selected, use it, otherwise default to 0
        const desiredCapacity = req.body.diskCapacity || 0;
        // Select the appropriate query based on the filters selected / build data
        if (!req.body.query) {
          query = {
            diskCapacity: { $gte: parseInt(desiredCapacity) },
          };
        }
        // Count the number of storage devices that match the query
        storageCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await storageFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });
        break;

      case 'case':
        // Select the appropraite query based on build data
        defaultQuery = {};
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.motherboard) {
            compatibility = await determineCaseCompatibility(currentBuild);
            query = { SupportedMotherboardSizes: { $in: [compatibility] } };
          } else {
            query = defaultQuery;
          }
        }
        else {
          query = defaultQuery;
        }
        // Count the number of cases that match the query
        caseCollection.countDocuments(query, async function (err, count) {
          if (err) {
            console.log(err);
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await caseFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });
        break;

      case 'cpucoolers':
        // If a filter for cooling type has been selected, use it, otherwise default to both air and liquid cooling
        // Select the appropriate query based on the filters selected/build data
        if (!req.body.query && req.body.build) {
          if (currentBuild.parts.cpu || currentBuild.parts.motherboard) {
            compatibility = await determineCpuCoolerCompatibility(currentBuild);
            if (!req.body.radiatorSize) {
              query = { supportedSockets: { $all: compatibility } };
            } else if (req.body.radiatorSize) {
              const desiredCoolingType = req.body.radiatorSize;
              if (desiredCoolingType == "AirCooling") { query = { supportedSockets: { $all: compatibility }, radiatorSize: "Air" }; }
              if (desiredCoolingType == "LiquidCooling") { query = { supportedSockets: { $all: compatibility }, radiatorSize: { $ne: "Air" } }; }
            }
          } else {
            query = {};
          }
        } else {
          if (req.body.radiatorSize) {
            const desiredCoolingType = req.body.radiatorSize
            if (desiredCoolingType == "AirCooling") { query = { radiatorSize: "Air" }; }
            if (desiredCoolingType == "LiquidCooling") { query = { radiatorSize: { $ne: "Air" } }; }
          } else {
            query = {};
          }
        }
        // Count the number of CPU coolers that match the query
        cpuCoolerCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await cpuCoolerFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });
        break;

      case 'powersupplies':
        // If a filter for power output has been selected, use it, otherwise default to 0
        const minPowerOutput = req.body.powerOutput || 0;
        const desiredRating = req.body.rating ? [req.body.rating] : ["Gold", "Platinum", "Titanium"];
        if (!req.body.query) {
          {
            query = {
              powerOutput: { $gte: parseInt(minPowerOutput) },
              rating: { $in: desiredRating },
            };
          }
        }
        // Count the number of power supplies that match the query
        powerSupplyCollection.countDocuments(query, async function (err, count) {
          if (err) {
            res.render('errorPage');
          } else {
            totalParts = count;
            results = await powerSupplyFilteredSearch(query, skip, perPage);
            searchFunction(results, partCategory, page, totalParts, query, currentBuildToPass);
          }
        });
        break;

      default:
        console.log("Error getting page");
        break;
    }
  });
};