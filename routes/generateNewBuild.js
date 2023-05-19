const express = require('express');
router = express.Router();
const makeAPIRequest = require('./OpenAIcall');


module.exports = function (app, userCollection) {

    function isJSONObject(obj) {
        return typeof obj === "object" && obj !== null;
    }

    app.post('/generateNewBuild', async (req, res) => {
        selectedParts = JSON.parse(req.body.selectedParts)
        console.log(selectedParts)
        var startOfPrompt = 'Prioritizing '
        var endOfPrompt = `Make me a PC Build in this format. Give it a unique name:
        {
                "class": "",
                    "name": "",
                        "parts": {
                "cpu": "",
                    "gpu": "",
                        "ram": [
                            "",
                            "",
                            "",
                            ""
                        ],
                            "motherboard": "",
                                "cpuCooler": "",
                                    "storage": "",
                                        "case": "",
                                            "powerSupply": ""
            }
        }`
        var checkboxStrings = ''
        var radioStrings = ''
        var middleOfPrompt = ''
        const createPromptFromParts = (parts) => {
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].selector == 'checkbox') {
                    checkboxStrings += parts[i].category + ': ' + parts[i].id + ', '
                }
                else if (parts[i].selector == 'radio') {
                    radioStrings += parts[i].category + ', '
                }
            }
        }
        createPromptFromParts(selectedParts)
        middleOfPrompt = checkboxStrings + radioStrings
        //change last two characters of middle of Prompt to '.'
        middleOfPrompt = middleOfPrompt.slice(0, -2) + '. '
        var fullPrompt = startOfPrompt + middleOfPrompt + endOfPrompt
        console.log(fullPrompt)
        // console.log(fullPrompt)

        buildDescription = await makeAPIRequest(fullPrompt);

        //replace quotations in keys
        parsedBuildDescription = JSON.parse(buildDescription)

        var existingBuild = false
        // console.log("At configurator post route")

        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        // console.log(existingUser)
        if (parsedBuildDescription in existingUser.favourites) {
            existingBuild = true
        }

        res.render('configurator', {
            builds: parsedBuildDescription,
            existingBuild: existingBuild,
            editBuild: false,
            buildSaved: false,
            invalidName: false, 
            buildCreated: true
        }
        );
    });





    app.post('/renderBuildFilters', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: false })
    });    
    
    app.post('/advancedFilterWithNotification', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: true })
    });
}