const express = require('express');
router = express.Router();


module.exports = function(app){
    app.post('/specs', (req, res) =>{

        const part = req.body.part;
        console.log(part);

        res.render('specsPage', { part: part } );
    })
}