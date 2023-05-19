const express = require('express');
const makeAPIRequest = require('./OpenAIcall');
router = express.Router();

module.exports = function (app) {
    app.post('/compare', async (req, res) => {
        // Acquire the two parts that the user wants to compare
        const firstComparedPart = req.body.selectedFirstPart;
        const secondComparedPart = req.body.selectedSecondPart;
        const partsType = req.body.partsType;

        // Instantiate the parts' names variables
        var part1Name;
        var part2Name;

        // Search for the "name" key in firstComparedPart's JSON object using a regex
        // and a for loop to find the key
        for (const [key, value] of Object.entries(JSON.parse(firstComparedPart))) {
            if (key != "_id") {
                if (key.toLowerCase().includes('name')) {
                    part1Name = value;
                }
            }
        }

        // Search for the "name" key in secondComparedPart's JSON object using a regex
        // and a for loop to find the key

        for (const [key, value] of Object.entries(JSON.parse(secondComparedPart))) {
            if (key != "_id") {
                if (key.toLowerCase().includes('name')) {
                    part2Name = value;
                }
            }
        }

        // Create the prompt that will be sent to the AI
        comparisonPropmt = (`${part1Name} vs ${part2Name} tldr`);
        console.log(comparisonPropmt);

        const answer = await makeAPIRequest(comparisonPropmt);
        // console.log(answer);



        console.log(part1Name);
        console.log(part2Name);
        // console.log(firstComparedPart);
        // console.log(secondComparedPart);

        res.render('comparisonPage', { firstComparedPart: firstComparedPart, secondComparedPart: secondComparedPart, resultAI: answer });
    })
}