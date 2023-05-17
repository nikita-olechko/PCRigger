var express = require('express');
router = express.Router;


module.exports = function (app, userCollection) {

    app.post('/specificBuildInfo', async (req, res) => {
        var build = JSON.parse(req.body.build)
        console.log("CPU Is" + build.parts.cpu)

        try { // console.log("At configurator post route")
            const cpus = await build.parts.cpu
            const gpus = await build.parts.gpu
            const memory = await build.parts.ram
            const storage = await build.parts.storage
            const motherboards = await build.parts.motherboard
            const powerSupply = await build.parts.powersupply
            const cases = await build.parts.case
            const cpuCoolers = await build.parts.cpuCooler

            res.render('info', {
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
        }
    });
}