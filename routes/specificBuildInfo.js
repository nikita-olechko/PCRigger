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


            // console.log("CPUS: " + cpus)
            // console.log("memory: " + memory)

            // give me an array and push the parts into it
            // then console.log the array
            const parts = [];
            parts.push(cpus, gpus, memory, storage, motherboards, powerSupply, cases, cpuCoolers);
            // console.log(parts);

            // Custom prompt for the AI
            const promptRequest = (`Tell me what this build suited for, be detailed: ${parts} `);

            // variable to store the AI's response
            var buildDescription;

            // get the current user
            const currentUser = req.session.user;

            // check if the buildDescription already exists in the user's document in the mongoDB, if it does, use that, if not, make the API call to the AI
            if (currentUser.buildDescription) {
                buildDescription = currentUser.buildDescription;
                console.log("Build description already exists in the database");
            } else {
                buildDescription = await makeAPIRequest(promptRequest);
                console.log("AI has been propmted to generate a build description");
            }

            res.render('specificBuildInfo', {
                build: build,
                cpus: cpus,
                gpus: gpus,
                memory: memory,
                storage: storage,
                motherboards: motherboards,
                powerSupply: powerSupply,
                cases: cases,
                cpuCoolers: cpuCoolers,
                renderedBuildDescription: buildDescription,
            });
        } catch (error) {
            console.error('Error retrieving data from MongoDB:', error);
            res.status(500).send('Internal Server Error');
            res.render("500");
        }
    });
}