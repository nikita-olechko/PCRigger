const express = require('express');
router = express.Router();
const mongoose = require('mongoose');
const utils = require('../utils');


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


module.exports = function (app) {
    app.get('/info', async (req, res) => {
        try {
            const cpus = await cpuCollection.find().toArray();
            const gpus = await gpuCollection.find().toArray();
            const memory = await memoryCollection.find().toArray();
            const storage = await storageCollection.find().toArray();
            const motherboards = await motherboardCollection.find().toArray();
            const powerSupply = await powerSupplyCollection.find().toArray();
            const cases = await caseCollection.find().toArray();
            const cpuCoolers = await cpuCoolerCollection.find().toArray();

            res.render('info', {
                cpus: cpus,
                gpus: gpus,
                memory: memory,
                storage: storage,
                motherboards: motherboards,
                powerSupply: powerSupply,
                cases: cases,
                cpuCoolers: cpuCoolers
            });
        } catch (error) {
            console.error('Error retrieving data from MongoDB:', error);
            res.status(500).send('Internal Server Error');
        }
    });
}
