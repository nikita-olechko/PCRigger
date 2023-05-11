var express = require('express');
const mongoose = require('mongoose');
router = express.Router();


const mongodb_database = process.env.MONGODB_DATABASE;

var {
    database
    } = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

module.exports = async function(app){

    function isValidSession(req, res) {
        console.log("checking session")
        if (req.session.user) {
            return true;
        }
        return false;
    }

    app.get('/profile', async (req, res) =>{
        if (!isValidSession(req)) {
            res.redirect('/login');
            return;   
        }

        user_profile = await userCollection.findOne({username: req.session.user.username});
        console.log(user_profile)

        // console.log(req.session)
        res.render('profile', {
            user: req.session.user.username,
            email: req.session.user.email,
            userType: req.session.user.user_type,
            sessionCreation: req.session.user.createdAt,
            securityQuestions: [
            req.session.user.security_question_1,
            req.session.user.security_question_2,
            req.session.user.security_question_3
        ], favourites: user_profile.favourites
        });
        })
    }