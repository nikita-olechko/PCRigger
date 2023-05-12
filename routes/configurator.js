var express = require('express');
const mongoose = require('mongoose');
router = express.Router;
const buildsModel = require('../models/buildsModel');
const utils = require('../utils');
const path = require('path');
const mime = require('mime');

module.exports = function (app, userCollection) {

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
        // console.log(build)
        // console.log(partToRemove)

        build.parts[partToRemove] = null

        // console.log(build)
        res.render('configurator', {
            builds: build,
        })
    })

    app.post("/addBuildToProfile", async (req, res) => {
        console.log("At addBuildToProfile post route")
        const build = JSON.parse(req.body.build)
        console.log(build)
        const userID = req.session.user.username;
        //get user profile
        const userProfile = await userCollection.findOne({
            username: userID
        });
        // console.log(userProfile)
        //add build to userProfile
        userProfile.favourites.push(build);
        // console.log(userProfile)
        // console.log(userProfile.favourites)
    });
}