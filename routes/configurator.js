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
        await userCollection.updateOne(
            { username: userID },
            { $push: { favourites: build } },
            function (err, res) {
                if (err) throw err;
                console.log('build added to user!');
            }
        );
        const userProfile = await userCollection.findOne({
            username: userID
        });

        // userProfile.favourites = [...userProfile.favourites, build]

        // await userCollection.deleteOne({ username: userID }, () => {
        //     console.log("User deleted");
        // });

        // await userCollection.insertOne(userProfile);
        //add build to userProfile
        console.log("Here is the user profile with the new build added")
        console.log(userProfile)
        console.log("Here is the favourites section")
        console.log(userProfile.favourites)
    });
}