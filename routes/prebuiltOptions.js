var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/prebuiltOptions', (req, res) =>{
        const formsData = [
            {route: "configurator", description: "Maximum Performance", formid: "performance"},
            // {route: "", description: "Power Efficient", formid: "efficient"},
        ]
        res.render('prebuiltOptions', {forms: formsData});
    })
}