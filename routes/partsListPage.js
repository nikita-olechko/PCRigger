const express = require('express');
router = express.Router;


module.exports = function (app) {
  app.get('/parts', (req, res) => {

    // TODO: After making the schemas and models,
    // create function that iterates through the models of parts and returns a card for each part


    res.render('partsListPage');
  })
}