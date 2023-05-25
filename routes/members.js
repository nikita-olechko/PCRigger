var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/members', (req, res) =>{
        const buttonsData = 
        // putting the buttons info in an array
        [
            { route: 'prebuiltOptions', description: 'Build Your PC' },
            { route: 'categories', description: 'Compare Parts' },
            { route: 'info', description: 'Info' }
        ];
        // rendering the members page with the buttons
        res.render('members', { buttons: buttonsData });
    });
};