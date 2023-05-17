var express = require('express');
router = express.Router;


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


            console.log("CPUS: " + cpus)
            console.log("memory: " + memory)

            res.render('info', {
                build: build,
                cpus: cpus,
                gpus: gpus,
                memory: memory,
                storage: storage,
                motherboards: motherboards,
                powerSupply: powerSupply,
                cases: cases,
                cpuCoolers: cpuCoolers
            });
        } catch (error) {
            console.error('Error retrieving data from MongoDB:', error);
            res.status(500).send('Internal Server Error');
            res.render("500");
        }
    });
}