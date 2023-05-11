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
    app.use(express.static(path.join(__dirname, 'scripts'), {
        setHeaders: (res, filePath) => {
            const mimeType = mime.getType(filePath);
            if (mimeType) {
            res.set('Content-Type', mimeType);
            }
        }
        }));
        
    app.post('/configurator', async (req, res) => {
        
        var desiredCategory = req.body.formId;


        await prebuilts.find({class: `${desiredCategory}`}).toArray(function (err, result) {
            if (err) {
                throw err
            } else {
                // console.log(result)
                res.render('configurator', {
                    builds: result,
                    index: 0
                })
            };
        })
    });
}