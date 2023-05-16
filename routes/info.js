const express = require('express');
router = express.Router();


module.exports = function(app){
    app.get('/info', (req, res) =>{
        res.render('info');
    })
}