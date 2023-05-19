require('dotenv').config();
const express = require('express');
router = express.Router();
const makeAPIRequest = require('./OpenAIcall');
const { schema } = require('../models/cpuModel');


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


    function createBuildPrompt(selectedParts) {
        var startOfPrompt = 'Prioritizing '
        var endOfPrompt = `Make me a PC Build in this format. Give it a unique name:
        {
                "class": "",
                    "name": "",
                        "parts": {
                "cpu": "",
                    "gpu": "",
                        "ram": [
                            "",
                            "",
                            "",
                            ""
                        ],
                            "motherboard": "",
                                "cpuCooler": "",
                                    "storage": "",
                                        "case": "",
                                            "powerSupply": ""
            }
        }`
        var checkboxStrings = ''
        var radioStrings = ''
        var middleOfPrompt = ''
        const createPromptFromParts = (parts) => {
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].selector == 'checkbox') {
                    checkboxStrings += parts[i].category + ': ' + parts[i].id + ', '
                }
                else if (parts[i].selector == 'radio') {
                    radioStrings += parts[i].category + ', '
                }
            }
        }
        createPromptFromParts(selectedParts)
        middleOfPrompt = checkboxStrings + radioStrings
        //change last two characters of middle of Prompt to '.'
        middleOfPrompt = middleOfPrompt.slice(0, -2) + '. '
        var fullPrompt = startOfPrompt + middleOfPrompt + endOfPrompt
        return fullPrompt
    }

    function getSchemaPrompt(key, part) {
        var startOfPrompt = "Respond Only with a JSON object. Create the following schema for " + part + ": "
        var endOfPrompt = ""
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
}`
        }
        else if (key == 'gpu') {
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
}`

        }
        else if (key == 'memory') {
            endOfPrompt = `{
    "memoryName" : string,
    "capacity" : Number,
    "gen" : string,
    "latency" : Number,
    "readUncached" : Number,
    "write" : Number
}`

        }
        else if (key == 'motherboard') {
            endOfPrompt = `{
    "name": string,
    "brand": string,
    "manufacturer": string,
    "socket": string,
    "supportedRamGeneration": array of strings,
    "formFactor": string,
    "ports": array of strings,
    "pcieGeneration": string,
}`
        }
        else if (key == 'cpuCooler') {
            endOfPrompt = `{
    "name": string,
    "brand": string,
    "supportedSockets": array of strings,
    "height": number,
    "powerDraw": number,
    "fanSize": number,
    "radiatorSize": string (if none, "Air")
}`
        }
        else if (key == 'storage') {
            endOfPrompt = `{
    "driveName" : String,
    "type" : string (ssd or HDD),
    "diskCapacity" : Number,
    "diskMark" : Number
}`
        }
        else if (key == 'case') {
            endOfPrompt = `{
    "manufacturer": string,
    "name": string,
    "SupportedMotherboardSizes": array of strings,
    "Dimensions": string,
    "Material": string,
    "DriveBays": string,
    "Ports": array of strings,
    "FanSupport": string,
}`
        }
        else if (key == 'powerSupply') {
            endOfPrompt = `{
"brand": string,
"name": string,
"manufacturer": string,
"oem": string,
"modular": boolean,
"powerOutput": number,
"rating": 80plusrating as a string,
}`
        }
        return startOfPrompt + endOfPrompt
    }

    async function checkPartsInDatabase(parsedBuildDescription) {
        // modify the parseBuildDescription so that it only has one part per category
        for (var key in parsedBuildDescription.parts) {
            if (!Array.isArray(parsedBuildDescription.parts[key])) {
                parsedBuildDescription.parts[key] = [parsedBuildDescription.parts[key]];
            }
            else {
                parsedBuildDescription.parts[key] = parsedBuildDescription.parts[key][0];
            }
            console.log("modified PraseBuildDescription" + JSON.stringify(parsedBuildDescription))
            for (let part of parsedBuildDescription.parts[key]) {
                let collection
                let partsInDatabase
                if (key == 'ram') {
                    partInDatabase = await memoryCollection.findOne({ memoryName: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await memoryCollection.insertOne(newPart);
                    }
                }
                else if (key == 'storage') {
                    partInDatabase = await storageCollection.findOne({ driveName: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await storageCollection.insertOne(newPart);
                    }
                }
                else if (key == 'case') {
                    partInDatabase = await caseCollection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await caseCollection.insertOne(newPart);
                    }
                }
                else if (key == 'powerSupply') {
                    partInDatabase = await powerSupplyCollection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await powerSupplyCollection.insertOne(newPart);
                    }
                }
                else if (key == 'cpuCooler') {
                    partInDatabase = await cpuCoolerCollection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await cpuCoolerCollection.insertOne(newPart);
                    }

                }
                else if (key == 'motherboard') {
                    partInDatabase = await motherboardCollection.findOne({ name: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await motherboardCollection.insertOne(newPart);
                    }
                }
                else if (key == 'gpu') {
                    partInDatabase = await gpuCollection.findOne({ productName: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        schemaPrompt = getSchemaPrompt(key, part);
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await gpuCollection.insertOne(newPart);
                    }
                }
                else if (key == 'cpu') {
                    partInDatabase = await cpuCollection.findOne({ cpuName: part });
                    partsInDatabase = partInDatabase !== null;
                    if (!partsInDatabase) {
                        console.log("part is: " + part)
                        schemaPrompt = getSchemaPrompt(key, part);
                        console.log(schemaPrompt)
                        newPart = await makeAPIRequest(schemaPrompt);
                        console.log("newPart is: " + newPart)
                        newPart = JSON.parse(newPart);
                        console.log("newPart is: " + newPart)
                        await cpuCollection.insertOne(newPart);
                    }
                }
            }
        }
    }

    app.post('/generateNewBuild', async (req, res) => {
        selectedParts = JSON.parse(req.body.selectedParts)
        // console.log(selectedParts)

        var fullPrompt = createBuildPrompt(selectedParts)

        // console.log(fullPrompt)

        // buildDescription = await makeAPIRequest(fullPrompt);
        buildDescription = `{
"class": "PC Build",
"name": "Mighty Micro",
"parts": {
"cpu": "Intel Core i9-11900K",
"gpu": "NVIDIA GeForce RTX 3080",
"ram": [
"Corsair Vengeance RGB Pro 32GB (2 x 16GB) DDR4-3200",
"Corsair Vengeance RGB Pro 32GB (2 x 16GB) DDR4-3200",
"Corsair Vengeance RGB Pro 32GB (2 x 16GB) DDR4-3200",
"Corsair Vengeance RGB Pro 32GB (2 x 16GB) DDR4-3200"
],
"motherboard": "ASUS ROG Strix Z590-G Gaming WiFi",
"cpuCooler": "NZXT Kraken X73",
"storage": "Samsung 980 Pro 1TB NVMe SSD",
"case": "NZXT H510 Elite",
"powerSupply": "Corsair RM750x"
}
}`

        //replace quotations in keys
        parsedBuildDescription = JSON.parse(buildDescription)

        var existingBuild = false
        // console.log("At configurator post route")

        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        // console.log(existingUser)
        if (parsedBuildDescription in existingUser.favourites) {
            existingBuild = true
        }
        // check if parts are in database        
        // Usage
        checkPartsInDatabase(parsedBuildDescription);

        res.render('configurator', {
            builds: parsedBuildDescription,
            existingBuild: existingBuild,
            editBuild: false,
            buildSaved: false,
            invalidName: false, 
            buildCreated: true
        }
        );
    });





    app.post('/renderBuildFilters', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: false })
    });

    app.post('/advancedFilterWithNotification', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: true })
    });
}