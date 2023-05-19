const express = require('express');
router = express.Router();

module.exports = function (app, userCollection) {

    app.post('/generateNewBuild', async (req, res) => {
        selectedParts = JSON.parse(req.body.selectedParts)
        console.log(selectedParts)

        const createPromptFromParts = (parts) => {
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].length == 0) {
                    return "Please select a part for each category"
                }
            }
        }
    });





    app.post('/renderBuildFilters', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: false })
    });    
    
    app.post('/advancedFilterWithNotification', async (req, res) => {
        res.render('AI_build', { noFactorsChosen: true })
    });
}