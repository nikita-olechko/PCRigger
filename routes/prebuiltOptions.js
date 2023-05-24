var express = require('express');
router = express.Router();
const mongodb_database = process.env.MONGODB_DATABASE;

var {
    database
} = include('databaseConnection');

const prebuilts = database.db(mongodb_database).collection('pcbuilds')

module.exports = function(app){
    app.get('/prebuiltOptions', async (req, res) =>{


        await prebuilts.find({}).toArray(function (err, result) {
        if (err) {
            res.render("errorPage")
        } else {
            buildTypes = new Set()
            result.forEach(object => {
                buildTypes.add(object.class)
            })
            console.log(buildTypes)

            formsData = []
            buildTypes.forEach(buildType => {
                formsData.push({route:"populateBuilds", description: buildType, formId: buildType})
            })
            res.render('prebuiltOptions', {forms: formsData});
        }})
    })


    app.post('/populateBuilds', async (req, res) => {
        var desiredCategory = req.body.formId;
        console.log(desiredCategory)
        await prebuilts.find({class: `${desiredCategory}`}).toArray(function (err, result) {
            if (err) {
                res.render("errorPage")
            } else {
                console.log(result)
                res.render('buildList', {
                    foundBuilds: result,
                })
            };
        })
    })
}