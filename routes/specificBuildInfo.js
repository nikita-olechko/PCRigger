var express = require('express');
router = express.Router;
const makeAPIRequest = require('./OpenAIcall');


module.exports = function (app, userCollection) {

    app.post('/specificBuildInfo', async (req, res) => {
        var build = JSON.parse(req.body.build);
        // console.log("CPU Is" + build.parts.cpu)

        try { // console.log("At configurator post route")
            const cpus = Array.isArray(await build.parts.cpu) ? await build.parts.cpu : [await build.parts.cpu];
            const gpus = Array.isArray(await build.parts.gpu) ? await build.parts.gpu : [await build.parts.gpu];
            const memory = Array.isArray(await build.parts.ram) ? await build.parts.ram : [await build.parts.ram];
            const storage = Array.isArray(await build.parts.storage) ? await build.parts.storage : [await build.parts.storage];
            const motherboards = Array.isArray(await build.parts.motherboard) ? await build.parts.motherboard : [await build.parts.motherboard];
            const powerSupply = Array.isArray(await build.parts.powerSupply) ? await build.parts.powerSupply : [await build.parts.powerSupply];
            const cases = Array.isArray(await build.parts.case) ? await build.parts.case : [await build.parts.case];
            const cpuCoolers = Array.isArray(await build.parts.cpuCooler) ? await build.parts.cpuCooler : [await build.parts.cpuCooler];

            // An array to store all the parts from the build object to be passed to AI
            const parts = [];
            parts.push(cpus, gpus, memory, storage, motherboards, powerSupply, cases, cpuCoolers);

            // Custom prompt for the AI including parts array so it gets context
            const promptRequest = (`Tell me what this build suited for, be detailed: ${parts} `);

            // Instantiate variable to store the AI's response
            var buildDescription;
            // get the current logged in user
            try {
            var currentUser = req.session.user;
            }
            catch (err) {
                console.log(err);
                res.render('login');
                return;
            }
            // Get the current build's name
            var buildTitle = build.name;
            console.log(buildTitle);


            // check if the buildDescription already exists in the user's document in MongoDB, if it does, use that, if not, make the API call to the AI
            if (currentUser.descriptions && currentUser.descriptions.length > 0) {
                const existingDescription = currentUser.descriptions.find((desc) => desc.buildTitle === buildTitle);
                if (existingDescription) {
                    buildDescription = existingDescription.description;
                    console.log("Build description already exists in the database");
                } else {
                    // If the build exists but has no description, make the API call to the AI
                    console.log("AI has been prompted to generate a build description, please wait...");
                    buildDescription = await makeAPIRequest(promptRequest);
                    const descriptionObj = { buildTitle: buildTitle, description: buildDescription };
                    await userCollection.updateOne(
                        { username: currentUser.username },
                        { $push: { descriptions: descriptionObj } }
                    );
                }
            } else {
                // If user doesn't have any descriptions yet, make the API call to the AI
                console.log("AI has been prompted to generate a build description, please wait...");
                buildDescription = await makeAPIRequest(promptRequest);
                const descriptionObj = { buildTitle: buildTitle, description: buildDescription };
                await userCollection.updateOne(
                    { username: currentUser.username },
                    { $push: { descriptions: descriptionObj } }
                );
            }

            // Refresh Session with freshly updated user from MongoDB
            try {
            currentUser = await userCollection.findOne({ username: req.session.user.username });
            req.session.user = currentUser;
            }
            catch (err) {
                console.log(err);
                res.render('login');
                return;
            }

            try{
            res.render('specificBuildInfo', {
                build: build,
                // These components are left in to help debug the code if needed
                cpus: cpus,
                gpus: gpus,
                memory: memory,
                storage: storage,
                motherboards: motherboards,
                powerSupply: powerSupply,
                cases: cases,
                cpuCoolers: cpuCoolers,
                // AI's response (build description) to be rendered in the ejs file
                renderedBuildDescription: buildDescription,
            });
        } catch (error) {
            res.render('errorPageForAI');
        }
        } catch (error) {
            res.render('errorPageForAI');
        }
    });
};