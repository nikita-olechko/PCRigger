const express = require('express');
router = express.Router();

module.exports = function (app, userCollection) {

    app.post('/generateNewBuild', async (req, res) => {
        selectedParts = JSON.parse(req.body.selectedParts)
        console.log(selectedParts)
    });    
    
    app.post('/renderBuildFilters', async (req, res) => {
        res.render('AI_build')
    });
}