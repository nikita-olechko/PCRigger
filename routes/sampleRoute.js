var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get('/sample', (req, res) =>{
        res.render('templates/notification_page.ejs', {message:'This is a sample route'})
    })
}