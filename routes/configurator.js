var express = require('express');
router = express.Router();
const mongoose = require('mongoose');
router = express.Router;
const buildsModel = require('../models/buildsModel');
const utils = require('../utils');
const path = require('path');
const mime = require('mime');

const mongodb_database = process.env.MONGODB_DATABASE;

var {
    database
} = include('databaseConnection');

const prebuilts = database.db(mongodb_database).collection('pcbuilds')

module.exports = function(app){
        
    app.post('/configurator', async (req, res) => {
        
        var desiredCategory = req.body.formId;

        await prebuilts.find({class: `${desiredCategory}`}).toArray(function (err, result) {
            if (err) {
                throw err
            } else {
                res.render('configurator', {
                    builds: result[0],
                })
            };
        })
    });

    app.post("/removePart", async (req, res) => {
        const partToRemove = req.body.partToRemove;
        const build = JSON.parse(req.body.build)
        console.log(build)
        console.log(partToRemove)

        build.parts[partToRemove] = null

        console.log(build)
        res.render('configurator', {
            builds: build,
        })
    })

    // app.get("/addPart", async (req, res) => {

    // })
}