var express = require('express');
const mongoose = require('mongoose');
router = express.Router;
const buildsModel = require('../models/buildsModel');
const utils = require('../utils');
const path = require('path');
const mime = require('mime');




module.exports = function (app, userCollection) {

    async function generateRandomUniqueID(length, req) {
        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        while (true) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomID = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomID += characters.charAt(randomIndex);
            }

            if (existingUser.favourites.some((item) => item._id === randomID)) {
                continue;
            }

            return randomID;
        }

    }

    const idLength = 8;

    app.post('/configurator', async (req, res) => {
        var existingBuild = false
        // console.log("At configurator post route")
        var build = JSON.parse(req.body.build)
        // console.log(build)

        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        // console.log(existingUser)
        if (build in existingUser.favourites) {
            existingBuild = true
        }

        res.render('configurator', {
            builds: build,
            existingBuild: existingBuild,
            editBuild: false,
            buildSaved: false,
            invalidName: false
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
            editBuild: true,
            buildSaved: false,
            invalidName: false
        })
    })

    app.post("/addPartToBuild", (req, res) => {
        console.log(JSON.parse(req.body.build))
        console.log(req.body.partCategory)
        console.log(req.body.partName)

        var build = JSON.parse(req.body.build)
        build.parts[req.body.partCategory] = req.body.partName

        res.render('configurator', {
            builds: build, existingBuild: false, editBuild: true,
            buildSaved: false,
            invalidName: false
        })
    })

    app.post("/addBuildToProfile", async (req, res) => {
        // console.log("At addBuildToProfile post route");
        // console.log(req.body.buttonType)
        if (req.body.buttonType === "addBuildToProfile") {
            console.log("At addBuildToProfile post route");
            console.log(req.body.build)
            var build = JSON.parse(req.body.build)
            build.name = req.body.buildTitle

            // Issue is here: same buildID is being created.
            // buildId = req.body.build._id
            // console.log(buildId)
            // if (buildId in existingUser.favourites._id) {
            //     console.log("Build already exists")
            // }


            const userID = req.session.user.username;
            var existingUser = await userCollection.findOne({ username: req.session.user.username });

            const nameExists = existingUser.favourites.some((item) => item.name === build.name);

            if (nameExists) {
                res.render("configurator", {
                    builds: build,
                    existingBuild: false,
                    editBuild: true,
                    buildSaved: true,
                    invalidName: true
                });
                return
                // The name exists in existingUser.favourites
            }

            const IDExists = existingUser.favourites.some((item) => item._id === build._id);
            console.log("IDExists" + IDExists)
            var newId = ""
            if (IDExists) {
                newId = await generateRandomUniqueID(idLength, req)
                console.log(newId)
                await userCollection.updateOne(
                    { username: userID, "favourites._id": build._id, "favourites._id": build.name },
                    { $set: { "favourites._id": newId } },
                    function (err, updateResult) {
                        if (err) throw err;
                        console.log("build updated!");
                    }
                );
            }


            await userCollection.updateOne(
                { username: userID },
                { $push: { favourites: build } },
                function (err, updateResult) {
                    if (err) throw err;
                    console.log("build added to user!");
                }
            );

            res.render("configurator", {
                builds: build,
                existingBuild: true,
                editBuild: true,
                buildSaved: false,
                invalidName: false
            });

        } else if (req.body.buttonType === "saveBuild") {
            console.log("At save route");
            var build = JSON.parse(req.body.build)
            var currentBuildName = build.name
            const userID = req.session.user.username;
            // console.log("Here is existingUser.favourites" + existingUser.favourites)
            // console.log(existingUser.favourites.name)
            // console.log(existingUser)
            var existingUser = await userCollection.findOne({ username: req.session.user.username });

            var nameExists = false;   
            console.log("req.body.buildTitle: " + req.body.buildTitle) 
            console.log("req.body.build.name: " + currentBuildName) 

            if (req.body.buildTitle === currentBuildName) {
                var nameExists = false;
            }
            else {
                var nameExists = existingUser.favourites.filter((item) => item.name === req.body.buildTitle).length >= 1;
            }

            if (nameExists) {
                res.render("configurator", {
                    builds: build,
                    existingBuild: false,
                    editBuild: true,
                    buildSaved: true,
                    invalidName: true
                });
                return
                // The name exists in existingUser.favourites
            }

            build.name = req.body.buildTitle

            await userCollection.updateOne(
                { username: userID, "favourites._id": build._id },
                { $set: { "favourites.$": build } },
                function (err, updateResult) {
                    if (err) throw err;
                    console.log("build updated!");
                }
            );

            res.render("configurator", {
                builds: build,
                existingBuild: false,
                editBuild: true,
                buildSaved: true,
                invalidName: false
            });
        }
    });


    app.post("/edit", async (req, res) => {
        var build = JSON.parse(req.body.build)
        var existingBuild = false
        // console.log(build)
        //get user profile
        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        // console.log(existingUser)
        if (build in existingUser.favourites) {
            existingBuild = true
        }


        res.render('configurator', {
            builds: build,
            existingBuild: existingBuild,
            editBuild: true,
            buildSaved: false,
            invalidName: false
        });

    });

    // app.post("/save", async (req, res) => {

    // });


}