const express = require('express');
router = express.Router();



module.exports = function(app){
    app.post('/compare', (req, res) =>{
        const firstComparedPart = req.body.selectedFirstPart;
        const secondComparedPart = req.body.selectedSecondPart;
        const partsType = req.body.partsType;
        console.log(partsType);
        console.log(firstComparedPart);
        console.log(secondComparedPart);
        res.render('comparisonPage',{firstComparedPart: firstComparedPart, secondComparedPart: secondComparedPart, partsType: partsType});
    })
}