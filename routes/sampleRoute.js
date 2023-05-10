var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/sample', (req, res) =>{
        res.send(`<h1>This is a sample route</h1>`)
    })
}