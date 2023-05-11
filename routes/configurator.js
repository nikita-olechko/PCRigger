var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/configurator', (req, res) =>{
        desiredCategory: req.query.desiredCategory;
        res.render('configurator', {
            // desiredCategory: desiredCategory
        })
    })
}