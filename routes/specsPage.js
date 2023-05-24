const express = require('express');
router = express.Router();

const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('databaseConnection');

// Parts collections
const memoryCollection = database.db(mongodb_database).collection('Memory');
const cpuCollection = database.db(mongodb_database).collection('CpuSpecs');
const gpuCollection = database.db(mongodb_database).collection('GpuSpecs');
const storageCollection = database.db(mongodb_database).collection('Storage');
const motherboardsCollection = database.db(mongodb_database).collection('Motherboards');
const powerSupplyCollection = database.db(mongodb_database).collection('Powersupplies');
// const ramCollection = database.db(mongodb_database).collection('Ram');
const caseCollection = database.db(mongodb_database).collection('Cases');
const cpuCoolerCollection = database.db(mongodb_database).collection('CpuCoolers');


module.exports = async function (app, userCollection) {
    app.post('/specs', (req, res) => {

        const part = req.body.part;
        console.log(part);

        res.render('specsPage', {
            part: part,
            partNotFound: false
        });
    });

    app.post('/infoSpecs', async (req, res) => {
        const partName = req.body.part;
        var searchTerm = partName;
        console.log(partName);
        const partCategory = req.body.partType;
        console.log(partCategory);
        // Determine which collection to search
        let collectionToSearch;
        if (partCategory == "cpu") {
            collectionToSearch = cpuCollection;
        } else if (partCategory == "memory") {
            collectionToSearch = memoryCollection;
        } else if (partCategory == "ram") {
            collectionToSearch = memoryCollection;
        } else if (partCategory == "gpu") {
            collectionToSearch = gpuCollection;
        } else if (partCategory == "storage") {
            collectionToSearch = storageCollection;
        } else if (partCategory == "motherboards") {
            collectionToSearch = motherboardsCollection;
        } else if (partCategory == "powersupplies") {
            collectionToSearch = powerSupplyCollection;
        } else if (partCategory == "case") {
            collectionToSearch = caseCollection;
        } else if (partCategory == "cpucoolers") {
            collectionToSearch = cpuCoolerCollection;
        } else {
            console.log("Error: Part category not found");
            return res.status(400).send("Error: Part category not found");
        }

        // // find the field in the document in the colletion that includes the "name" suffix in the field-name

        // // Find the PC part that has a name that matches the search term 
        // const foundPart = await collectionToSearch.findOne({
        //     $or: [
        //         { [partName]: searchTerm },
        //         { name: searchTerm }]
        // });
        fieldToSearch = partCategory + "Name";
        console.log("Field to search: " + fieldToSearch);

        // // Find the PC part that has a name that matches the search term 
        // const foundPart = await collectionToSearch.findOne({
        //     $or: [
        //         { [fieldToSearch]: searchTerm },
        //         { name: searchTerm }]
        // });
        const regex = new RegExp(searchTerm, 'i'); // 'i' flag makes the search case-insensitive
        const foundPart = await collectionToSearch.findOne({
            $or: [
                { [fieldToSearch]: regex },
                { name: regex },
                { driveName: regex },
                { productName: regex },
                { memoryName: regex },
            ]
        });


        // console.log(foundPart);

        // Render a response with the found part data or a message if no part was found
        if (foundPart) {
            res.status(200);
            res.render('specsPage', {
                part: JSON.stringify(foundPart),
                partCategory: partCategory,
                partNotFound: false,
                searchTerm: searchTerm,
            });

        } else {
            res.status(200);
            res.render('specsPage', {
                part: null,
                partCategory: partCategory,
                partNotFound: true,
                searchTerm: searchTerm,
            });

        }
    });
};