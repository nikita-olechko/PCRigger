require('dotenv').config();
const express = require('express');
const router = express.Router();
const makeAPIRequest = require('./OpenAIcall');


module.exports = function (app, userCollection) {

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
 * Generates a prompt for creating a PC build based on selected parts and budget.
 * @param {Object[]} selectedParts - An array of selected parts.
 * @param {number} budget - The budget for the build.
 * @returns {string} - The generated prompt.
 */
    function createBuildPrompt(selectedParts, budget) {
        var startOfPrompt = 'Prioritizing ';
        var endOfPrompt = `Make me a PC Build in this format. The budget should be $${budget}. Give the build a unique name:
        {
          "class": "",
          "name": "",
          "parts": {
            "cpu": "",
            "gpu": "",
            "ram": ["", ...],
            "motherboard": "",
            "cpuCooler": "",
            "storage": "",
            "case": "",
            "powerSupply": "",
            "budget": number
          }
        }`;
        var checkboxStrings = '';
        var radioStrings = '';
        var middleOfPrompt = '';

        /**
         * Creates prompt strings based on the selected parts.
         * @param {Object[]} parts - An array of selected parts.
         */
        const createPromptFromParts = (parts) => {
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].selector == 'checkbox') {
                    checkboxStrings += parts[i].category + ': ' + parts[i].id + ', ';
                } else if (parts[i].selector == 'radio') {
                    radioStrings += parts[i].category + ', ';
                }
            }
        };

        createPromptFromParts(selectedParts);
        middleOfPrompt = checkboxStrings + radioStrings;
        // Change last two characters of middle of Prompt to '.'.
        middleOfPrompt = middleOfPrompt.slice(0, -2) + '. ';
        var fullPrompt = startOfPrompt + middleOfPrompt + endOfPrompt;
        return fullPrompt;
    }

    /**
     * Generates a prompt for creating a schema for a specific part.
     * @param {string} key - The key indicating the part type.
     * @param {string} part - The name of the part.
     * @returns {string} - The generated prompt.
     */
    function getSchemaPrompt(key, part) {
        var startOfPrompt = "Respond Only with a JSON object. Create the following schema for " + part + ": ";
        var endOfPrompt = "";
        if (key == 'cpu') {
            endOfPrompt = `{
      "cpuName" : string,
      "cpuMark" : Number,
      "threadMark" : Number,
      "TDP" : Number,
      "powerPerf" : Number,
      "cores" : Number,
      "socket" : string,
      "category" : string (Desktop, workstation)
    }`;
        } else if (key == 'gpu') {
            endOfPrompt = `{
      "manufacturer" : string,
      "productName" : manufacturer + product name as a string,
      "releaseYear" : Number,
      "memSize" : Number,
      "memBusWidth" : Number,
      "gpuClock" : Number,
      "memClock" : Number,
      "unifiedShader" : Number,
      "tmu" : Number,
      "rop" : Number,
      "pixelShader" : Number,
      "vertexShader" : Number,
      "igp" : Number,
      "bus" :  string (e.g, PCIe 4.0, PCIe 3.0),
      "memType" : string,
      "gpuChip" : string
    }`;
        } else if (key == 'memory') {
            endOfPrompt = `{
      "memoryName" : string,
      "capacity" : Number,
      "gen" : string,
      "latency" : Number,
      "readUncached" : Number,
      "write" : Number
    }`;
        } else if (key == 'motherboard') {
            endOfPrompt = `{
      "name": string,
      "brand": string,
      "manufacturer": string,
      "socket": string,
      "supportedRamGeneration": array of strings,
      "formFactor": string,
      "ports": array of strings,
      "pcieGeneration": string,
    }`;
        } else if (key == 'cpuCooler') {
            endOfPrompt = `{
      "name": string,
      "brand": string,
      "supportedSockets": array of strings,
      "height": number,
      "powerDraw": number,
      "fanSize": number,
      "radiatorSize": string (if none, "Air")
    }`;
        } else if (key == 'storage') {
            endOfPrompt = `{
      "driveName" : String,
      "type" : string (ssd or HDD),
      "diskCapacity" : Number,
      "diskMark" : Number
    }`;
        } else if (key == 'case') {
            endOfPrompt = `{
      "manufacturer": string,
      "name": string,
      "SupportedMotherboardSizes": array of strings,
      "Dimensions": string,
      "Material": string,
      "DriveBays": string,
      "Ports": array of strings,
      "FanSupport": string,
    }`;
        } else if (key == 'powerSupply') {
            endOfPrompt = `{
      "brand": string,
      "name": string,
      "manufacturer": string,
      "oem": string,
      "modular": boolean,
      "powerOutput": number,
      "rating": 80plus rating as a string of either (Bronze, Silver, Gold, Platinum, Titanium),
    }`;
        }
        return startOfPrompt + endOfPrompt;
    }

    /**
     * Retrieves a new part based on the given schema prompt.
     * @param {string} schemaPrompt - The prompt for creating a schema.
     * @param {number} internalErrorCount - The count of internal errors occurred.
     * @returns {Object} - The new part.
     */
    async function getNewPart(schemaPrompt, internalErrorCount = 0) {
        newPart = await makeAPIRequest(schemaPrompt);
        console.log("newPart: " + newPart);
        console.log("getNewPart iteration: " + internalErrorCount);
        // If newPart is null, try again up to 5 times
        if (newPart == null) {
            internalErrorCount++;
            if (internalErrorCount > 5) {
                return newPart;
            } else {
                newPart = await getNewPart(schemaPrompt, internalErrorCount);
            }
        }
        return newPart;
    }

    /**
     * Checks if the parts in the parsed build description exist in the database and update it if not.
     * @param {Object} parsedBuildDescription - The parsed build description.
     */
    async function checkPartsInDatabase(parsedBuildDescription) {
        for (var key in parsedBuildDescription.parts) {
            if (!Array.isArray(parsedBuildDescription.parts[key])) {
                parsedBuildDescription.parts[key] = [parsedBuildDescription.parts[key]];
            } else {
                parsedBuildDescription.parts[key] = [parsedBuildDescription.parts[key][0]];
            }
            console.log("modified PraseBuildDescription" + JSON.stringify(parsedBuildDescription));
            for (let part of parsedBuildDescription.parts[key]) {
                console.log("iterable: " + parsedBuildDescription.parts[key]);
                console.log("part: " + part);
                console.log("key: " + key);
                let collection;
                let partInDatabase;
                let partsInDatabase;
                // Check if the part exists in the database
                if (key == 'ram') {
                    collection = memoryCollection;
                    partInDatabase = await collection.findOne({ memoryName: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'storage') {
                    collection = storageCollection;
                    partInDatabase = await collection.findOne({ driveName: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'case') {
                    collection = caseCollection;
                    partInDatabase = await collection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'powerSupply') {
                    collection = powerSupplyCollection;
                    partInDatabase = await collection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'cpuCooler') {
                    collection = cpuCoolerCollection;
                    partInDatabase = await collection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'motherboard') {
                    collection = motherboardCollection;
                    partInDatabase = await collection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'gpu') {
                    collection = gpuCollection;
                    partInDatabase = await collection.findOne({ productName: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'cpu') {
                    collection = cpuCollection;
                    partInDatabase = await collection.findOne({ cpuName: part });
                    partsInDatabase = partInDatabase !== null;
                } else if (key == 'budget') {
                    continue;
                }
                console.log("partsInDatabase: " + partsInDatabase);
                if (!partsInDatabase) {
                    internalErrorCount = 0;
                    schemaPrompt = getSchemaPrompt(key, part);
                    console.log("schema prompt is: " + schemaPrompt);
                    newPart = await getNewPart(schemaPrompt);
                    console.log("newPart is: " + newPart);
                    if (newPart == null) {
                        continue;
                    }
                    newPart = JSON.parse(newPart);
                    await collection.insertOne(newPart);
                }
            }
        }
    }

    /**
     * Generates a new build based on the selected parts and budget.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    // Generate a new build
    app.post('/generateNewBuild', async (req, res) => {
        selectedParts = JSON.parse(req.body.selectedParts);
        budget = req.body.budget;

        var fullPrompt = createBuildPrompt(selectedParts, budget);

        buildDescription = await makeAPIRequest(fullPrompt);
        console.log(buildDescription);

        parsedBuildDescription = JSON.parse(buildDescription);

        var existingBuild = false;
        // Check if the build already exists in the user's favourites
        try {
            var existingUser = await userCollection.findOne({ username: req.session.user.username });
        } catch (err) {
            console.log(err);
            res.render('login');
            return;
        }
        if (parsedBuildDescription in existingUser.favourites) {
            existingBuild = true;
        }
        checkPartsInDatabase(parsedBuildDescription);

        console.log(parsedBuildDescription.parts.budget);

        res.render('configurator', {
            builds: parsedBuildDescription,
            existingBuild: existingBuild,
            budget: parsedBuildDescription.parts.budget,
            editBuild: false,
            buildSaved: false,
            invalidName: false,
            buildCreated: false,
            partError: false
        });
    });

    app.post('/renderBuildFilters', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: false, reset: false })
    });

    app.post('/advancedFilterWithNotification', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: true, reset: false })
    });    
    
    app.post('/advancedFiltersReset', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: false, reset: true })
    });
};