var express = require('express');
const router = express.Router;

/**

    Configurator Middleware
    @param {Object} app - Express application instance
    @param {Object} userCollection - Database collection for user data
    */
module.exports = function (app, userCollection) {

    /**
    
        Generates a random unique ID of a given length.
        @param {number} length - Length of the ID
        @param {Object} req - Express request object
        @returns {Promise<string>} - Random unique ID
        */
    async function generateRandomUniqueID(length, req) {
        try {
            // Find an existing user based on the session username
            var existingUser = await userCollection.findOne({ username: req.session.user.username });
        } catch (err) {
            console.log(err);
            res.render('login'); // Render the login page
            return;
        }

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

    const idLength = 12;

    /**
    
        POST route for handling the configurator form submission.
        @param {Object} req - Express request object
        @param {Object} res - Express response object
        */
    app.post('/configurator', async (req, res) => {
        var existingBuild = false;
        var build = JSON.parse(req.body.build);

        // If the user is logged in, mark existingBuild as true if the build already exists in their favourites
        try {
            var existingUser = await userCollection.findOne({ username: req.session.user.username });
        } catch (err) {
            console.log(err);
            res.render('login'); // Render the login page
            return;
        }

        if (build in existingUser.favourites) {
            existingBuild = true;
        }

        // Render the configurator template with the appropriate data
        res.render('configurator', {
            builds: build,
            existingBuild: existingBuild,
            editBuild: false,
            buildSaved: false,
            invalidName: false,
            buildCreated: false,
            partError: false
        });

    });

    /**
    
        POST route for removing a part from a build.
        @param {Object} req - Express request object
        @param {Object} res - Express response object
        */
    app.post("/removePart", async (req, res) => {
        const partToRemove = req.body.partToRemove;
        const build = JSON.parse(req.body.build);
        build.parts[partToRemove] = null;
        // Render the configurator template with the appropriate data
        res.render('configurator', {
            builds: build,
            existingBuild: false,
            editBuild: true,
            buildSaved: false,
            invalidName: false,
            buildCreated: false,
            partError: false
        });

    });

    /**
    
        POST route for adding a part to a build.
        @param {Object} req - Express request object
        @param {Object} res - Express response object
        */
    app.post("/addPartToBuild", (req, res) => {
        var build = JSON.parse(req.body.build);
        build.parts[req.body.partCategory] = req.body.partName;
        // Render the configurator template with the appropriate data
        res.render('configurator', {
            builds: build,
            existingBuild: false,
            editBuild: true,
            buildSaved: false,
            invalidName: false,
            buildCreated: false,
            partError: false
        });

    });

    /**
    
        POST route for adding a build to a user's profile.
    
        @param {Object} req - Express request object
    
        @param {Object} res - Express response object
        */
    app.post("/addBuildToProfile", async (req, res) => {
        if (req.body.buttonType === "addBuildToProfile") {
            var build = JSON.parse(req.body.build);
            build.name = req.body.buildTitle;

            try {
                var existingUser = await userCollection.findOne({ username: req.session.user.username });
            } catch (err) {
                console.log(err);
                res.render('login'); // Render the login page
                return;
            }

            const nameExists = existingUser.favourites.some((item) => item.name === build.name);
            // If the user tries to save a build with a name that already exists
            if (nameExists) {
                res.render("configurator", {
                    builds: build,
                    existingBuild: false,
                    editBuild: true,
                    buildSaved: true,
                    invalidName: true,
                    buildCreated: false,
                    partError: false
                });
                return;
            }
            // Generate a random unique ID for the build
            const IDExists = existingUser.favourites.some((item) => item._id === build._id);
            var newId = "";
            if (IDExists) {
                newId = await generateRandomUniqueID(idLength, req);
                build._id = newId;
            }
            // Add the build to the user's profile
            const userID = req.session.user.username;
            await userCollection.updateOne(
                { username: userID },
                { $push: { favourites: build } },
                function (err, updateResult) {
                    if (err) {
                        res.render('errorPage'); // Render the error page
                    } else {
                        console.log("build added to user!");
                    }
                }
            );

            // Render the configurator template with the appropriate data
            res.render("configurator", {
                builds: build,
                existingBuild: true,
                editBuild: true,
                buildSaved: false,
                invalidName: false,
                buildCreated: false,
                partError: false
            });
        
            // If the user clicks the "save build" button
        } else if (req.body.buttonType === "saveBuild") {

            var build = JSON.parse(req.body.build);
            var currentBuildName = build.name;

            try {
                const userID = req.session.user.username;
                var existingUser = await userCollection.findOne({ username: req.session.user.username });
            } catch (err) {
                console.log(err);
                res.render('login'); // Render the login page
                return;
            }

            var nameExists = false;

            if (req.body.buildTitle === currentBuildName) {
                nameExists = false;
            } else {
                nameExists = existingUser.favourites.filter((item) => item.name === req.body.buildTitle).length >= 1;
            }

            if (nameExists) {
                res.render("configurator", {
                    builds: build,
                    existingBuild: false,
                    editBuild: true,
                    buildSaved: true,
                    invalidName: true,
                    buildCreated: false,
                    partError: false
                });
                return;
            }

            build.name = req.body.buildTitle;

            await userCollection.updateOne(
                { username: req.session.user.username, "favourites._id": build._id },
                { $set: { "favourites.$": build } },
                function (err, updateResult) {
                    if (err) {
                        res.render('errorPage'); // Render the error page
                    } else {
                        console.log("build updated!");
                    }
                }
            );

            // Render the configurator template with the appropriate data
            res.render("configurator", {
                builds: build,
                existingBuild: false,
                editBuild: true,
                buildSaved: true,
                invalidName: false,
                buildCreated: false,
                partError: false
            });
        }

    });

    /**
    
        POST route for editing a build.
        @param {Object} req - Express request object
        @param {Object} res - Express response object
        */
    app.post("/edit", async (req, res) => {
        var build = JSON.parse(req.body.build);
        var existingBuild = false;
        try {
            var existingUser = await userCollection.findOne({ username: req.session.user.username });
        } catch (err) {
            console.log(err);
            res.render('login'); // Render the login page
            return;
        }

        if (build in existingUser.favourites) {
            existingBuild = true;
        }

        // Render the configurator template with the appropriate data
        res.render('configurator', {
            builds: build,
            existingBuild: existingBuild,
            editBuild: true,
            buildSaved: false,
            invalidName: false,
            buildCreated: false,
            partError: false
        });

    });

};