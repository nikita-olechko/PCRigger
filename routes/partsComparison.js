const express = require('express');
router = express.Router();



module.exports = function(app){
    app.get('/compare', (req, res) =>{
        res.render('comparisonPage');
    })
}