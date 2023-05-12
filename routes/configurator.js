var express = require('express');
router = express.Router();
const mongoose = require('mongoose');
router = express.Router;
const buildsModel = require('../models/buildsModel');
const utils = require('../utils');
const path = require('path');
const mime = require('mime');

module.exports = function(app){
        
    app.post('/configurator', async (req, res) => {
        
        var build = JSON.parse(req.body.build)

            res.render('configurator', {
                builds: build,
            }
            );
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