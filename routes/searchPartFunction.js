const express = require('express');
const mongoose = require('mongoose');
router = express.Router();
const utils = require('../utils');

// Constants
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


module.exports = function (app) {
    app.get('/searchPart', async (req, res) => {
        const searchTerm = req.query.partName;
        const partCategory = req.query.partCategory;
        console.log("Search term is: " + searchTerm);
        console.log("Search cat part type: " + partCategory);

        // Determine which collection to search, ugly but works...
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
                ] });


        // console.log(foundPart);

        // Render a response with the found part data or a message if no part was found
        if (foundPart) {
            res.status(200);
            res.render('specsPage', {
                part: JSON.stringify(foundPart),
                partCategory: partCategory,
                searchTerm: searchTerm,
                partNotFound: false
            });

        } else {
            // If the part doesn't exist in the database, render the specs page with a null part and a part not found message for pop up 
            res.render('specsPage', {
                part: null,
                partCategory: partCategory,
                searchTerm: searchTerm,
                partNotFound: true
            });        };
    })
}