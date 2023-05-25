var express = require('express');
router = express.Router();

module.exports = function(app){
    app.get("*", (req, res) => {
        res.status(404).render('404');
      });
};