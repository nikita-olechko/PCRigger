var express = require('express');
router = express.Router;
const makeAPIRequest = require('./OpenAIcall');


module.exports = function (app, userCollection) {

    app.post('/specificBuildInfo', async (req, res) => {
        var build = JSON.parse(req.body.build)
        // console.log("CPU Is" + build.parts.cpu)

        try { // console.log("At configurator post route")
            const cpus = Array.isArray(await build.parts.cpu) ? await build.parts.cpu : [await build.parts.cpu];
            const gpus = Array.isArray(await build.parts.gpu) ? await build.parts.gpu : [await build.parts.gpu];
            const memory = Array.isArray(await build.parts.ram) ? await build.parts.ram : [await build.parts.ram];
            const storage = Array.isArray(await build.parts.storage) ? await build.parts.storage : [await build.parts.storage];
            const motherboards = Array.isArray(await build.parts.motherboard) ? await build.parts.motherboard : [await build.parts.motherboard];
            const powerSupply = Array.isArray(await build.parts.powersupply) ? await build.parts.powersupply : [await build.parts.powersupply];
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
            var currentUser = req.session.user;
            // Get the current build's name
            var buildTitle = build.name;
            console.log(buildTitle);


            // check if the buildDescription already exists in the user's document in the mongoDB, if it does, use that, if not, make the API call to the AI
            if (currentUser[buildTitle]) {
                buildDescription = currentUser[buildTitle];
                console.log("Build description already exists in the database");
            } else {
                // if user doesn't have a build description, make the API call to the AI
                // then insert the build description into the user's document in the mongoDB
                console.log("AI has been propmted to generate a build description, pls wait...");
                buildDescription = await makeAPIRequest(promptRequest);
                await userCollection.updateOne(
                    { username: currentUser.username },
                    { $set: { [buildTitle]: buildDescription } });
            }

            // Refresh Session with freshly updated user from MongoDB
            currentUser = await userCollection.findOne({ username: req.session.user.username });

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
            console.error('Error retrieving data from MongoDB:', error);
            res.status(500).send('Internal Server Error').render("500");
        }
    });
}