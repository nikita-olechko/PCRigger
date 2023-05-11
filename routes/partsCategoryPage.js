const express = require('express');
router = express.Router();



module.exports = function(app){
    app.get('/categories', (req, res) =>{
        res.render('partsCategoryPage');
    })
}