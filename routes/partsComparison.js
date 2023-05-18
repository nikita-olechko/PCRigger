const express = require('express');
const makeAPIRequest = require('./OpenAIcall');
router = express.Router();

module.exports = function (app) {
    app.post('/compare', async (req, res) => {
        const firstComparedPart = req.body.selectedFirstPart;
        const secondComparedPart = req.body.selectedSecondPart;
        const partsType = req.body.partsType;

        var part1Name;
        var part2Name;
        for (const [key, value] of Object.entries(JSON.parse(firstComparedPart))) {
            if (key != "_id") {
                if (key.toLowerCase().includes('name')) {
                    part1Name = value;
                }
            }
        }

        for (const [key, value] of Object.entries(JSON.parse(secondComparedPart))) {
            if (key != "_id") {
                if (key.toLowerCase().includes('name')) {
                    part2Name = value;
                }
            }
        }

        comparisonPropmt = (`${part1Name} vs ${part2Name} tldr`);
        console.log(comparisonPropmt);

        const answer = await makeAPIRequest(comparisonPropmt);
        console.log(answer);



        console.log(part1Name);
        console.log(part2Name);
        // console.log(firstComparedPart);
        // console.log(secondComparedPart);

        res.render('comparisonPage', { firstComparedPart: firstComparedPart, secondComparedPart: secondComparedPart, resultAI: answer });
    })
}



    // const part1Name = Object.keys(JSON.parse(firstComparedPart)).forEach(key => {
    //     console.log(key.toLocaleLowerCase());
    //   if (key.toLowerCase().includes('name')) {
    //     objName = firstComparedPart[key];
    //     console.log(objName);
    //     return objName;
    //   }
    // });

    // const part2Name =
    // Object.keys(JSON.parse(secondComparedPart)).forEach(key => {
    //     // console.log("BOBZ");
    //   if (key.toLowerCase().includes('name')) {
    //     objName = secondComparedPart[key];
    //     return objName;
    //   }
    // });

    // if (firstComparedPart.name) {
//   part1Name = firstComparedPart.name;
// } else if (firstComparedPart.cpuName) {
//   part1Name = firstComparedPart.cpuName;
// } else if (firstComparedPart.driveName) {
    //   part1Name = firstComparedPart.driveName;
// } else if (firstComparedPart.memoryName) {
//   part1Name = firstComparedPart.memoryName;
// } else if (firstComparedPart.productName) {
//   part1Name = firstComparedPart.productName;
//   console.log(part1Name);
// }

// if (secondComparedPart.name) {
//     part2Name = secondComparedPart.name;
// } else if (secondComparedPart.cpuName) {
//     part2Name = secondComparedPart.cpuName;
// } else if (secondComparedPart.driveName) {
//     part2Name = secondComparedPart.driveName;
// } else if (secondComparedPart.memoryName) {
//     part2Name = secondComparedPart.memoryName;
// } else if (secondComparedPart.productName) {
//     part2Name = secondComparedPart.productName;
// }