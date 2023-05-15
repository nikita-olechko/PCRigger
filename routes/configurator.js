var express = require('express');
const mongoose = require('mongoose');
router = express.Router;
const buildsModel = require('../models/buildsModel');
const utils = require('../utils');
const path = require('path');
const mime = require('mime');

module.exports = function (app, userCollection) {

    app.post('/configurator', async (req, res) => {
        var existingBuild = false
        console.log("At configurator post route")
        var build = JSON.parse(req.body.build)
        console.log(build)

        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        console.log(existingUser)
        if (build in existingUser.favourites) {
            existingBuild = true
        }

        res.render('configurator', {
            builds: build,
            existingBuild: existingBuild,
            editBuild: false
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
            existingBuild: false,
            editBuild: false
        })
    })

    app.post("/addPartToBuild", (req, res) => {
        console.log(JSON.parse(req.body.build))
        console.log(req.body.partCategory)
        console.log(req.body.partName)

        var build = JSON.parse(req.body.build)
        build.parts[req.body.partCategory] = req.body.partName

        res.render('configurator', {builds: build, existingBuild: false})
    })

    app.post("/addBuildToProfile", async (req, res) => {
        console.log("At addBuildToProfile post route")
        var build = JSON.parse(req.body.build)
        // console.log(build)
        var buildName = req.body.buildTitle
        build.name = buildName
        // console.log(build)
        const userID = req.session.user.username;
        //get user profile
        await userCollection.updateOne(
            { username: userID },
            { $push: { favourites: build } },
            function (err, res) {
                if (err) throw err;
                console.log('build added to user!');
            }
        );

        res.render('configurator', {
            builds: build,
            existingBuild: true,
            editBuild: false
        });

    });
    
    app.post("/edit", async (req, res) => {
        console.log("At edit route")
        var build = JSON.parse(req.body.build)
        // console.log(build)
        var buildName = req.body.buildTitle
        build.name = buildName
        // console.log(build)
        const userID = req.session.user.username;
        //get user profile
        await userCollection.updateOne(
            { username: userID },
            { $push: { favourites: build } },
            function (err, res) {
                if (err) throw err;
                console.log('build added to user!');
            }
        );

        res.render('configurator', {
            builds: build,
            existingBuild: false,
            editBuild: true
        });

    });

}