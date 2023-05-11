var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/members', (req, res) =>{
        const buttonsData = [
            { route: 'prebuiltOptions', description: 'Build Your PC' },
            { route: '#', description: 'Compare Parts' },
            { route: '#', description: 'Info' }
        ];
        res.render('members', { buttons: buttonsData });
    })
}