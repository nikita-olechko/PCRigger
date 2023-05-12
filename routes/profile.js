var express = require('express');
const mongoose = require('mongoose');
router = express.Router();


const mongodb_database = process.env.MONGODB_DATABASE;

var {
    database
} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

module.exports = async function (app, Joi, bcrypt, saltRounds) {

    function isValidSession(req, res) {
        console.log("checking session")
        if (req.session.user) {
            return true;
        }
        return false;
    }

    app.get('/profile', async (req, res) => {
        if (!isValidSession(req)) {
            res.redirect('/login');
            return;
        }

        user_profile = await userCollection.findOne({ username: req.session.user.username });
        builds = user_profile.favourites
        // console.log(user_profile.favourites)


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
            ], favourites: user_profile.favourites,
            builds: builds
        });

    })

    app.get('/edit', async (req, res) => {
        if (!isValidSession(req)) {
            res.redirect('/login');
            return;
        }
        const buttonsData = [
            { route: 'username_edit', description: 'Username' },
            { route: 'password_edit', description: 'Password' },
        ]
        res.render('profile_edit', { buttons: buttonsData })
    })

    app.get('/username_edit', async (req, res) => {
        if (!isValidSession(req)) {
            res.redirect('/login');
            return;
        }
        user_profile = await userCollection.findOne({ username: req.session.user.username });
        const userID = user_profile.username;
        res.render('username_edit', { userID: userID })
    })

    app.post('/username_edit', async (req, res) => {
        const schema = Joi.object({
            new_UserID: Joi.string().alphanum().min(3).max(20).required(),
        });
        var { new_UserID } = req.body;
        const validationResult = schema.validate({
            new_UserID,
        });
        //update user profile
        if (!validationResult.error) {
            await userCollection.updateOne(
                { username: req.session.user.username },
                { $set: { username: new_UserID } }
            );
            req.session.user.username = new_UserID;
            //update session
            res.render('templates/notification_page.ejs', {message:'Username has been updated.'})
        }
    })

    app.get('/password_edit', async (req, res) => {
        if (!isValidSession(req)) {
            res.redirect('/login');
            return;
        }
        user_profile = await userCollection.findOne({ username: req.session.user.username });
        const password = user_profile.password;
        res.render('password_edit', { password: password })
    })

    app.post('/password_edit', async (req, res) => {
        const schema = Joi.object({
            new_password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        var { new_password, confirm_password } = req.body;
        const validationResult = schema.validate({
            new_password,
            confirm_password
        });
        //update user profile
        if (!validationResult.error) {
            if (new_password === confirm_password) {
                new_password = await bcrypt.hash(new_password, saltRounds);
                await userCollection.updateOne(
                    { username: req.session.user.username },
                    { $set: { password: new_password } }
                )
                req.session.user.password = new_password;
                //update session
                res.render('templates/notification_page.ejs', {message:'Password has been updated.'})
            } else {
                res.render('templates/notification_page.ejs', {message:'Passwords do not match. Please try again.'})
            }
        }
    })

    app.post('/delete', async (req, res) => {
        console.log("delete")
        var build = JSON.parse(req.body.build)
        var existingUser = await userCollection.findOne({ username: req.session.user.username });
        console.log(build in existingUser.favourites)
        //delete the build from the user's favourites
        await userCollection.updateOne(
            { username: req.session.user.username },
            { $pull: { favourites: build } }
        )
        res.redirect('/profile');


    })
}
