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
        user_profile = await userCollection.findOne({ username: req.session.user.username });
        const userID = user_profile.username;
        res.render('profile_edit', { userID: userID }
        );
    })

    app.post('/edit', async (req, res) => {
        const schema = Joi.object({
            new_UserID: Joi.string().alphanum().min(3).max(20).required(),
            new_password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        var { new_UserID, new_password } = req.body;
        const validationResult = schema.validate({
            new_UserID,
            new_password
        });
        //update user profile
        if (!validationResult.error) {
            new_password = await bcrypt.hash(new_password, saltRounds);
            if (new_password.trim() === '') {
                await userCollection.updateOne(
                    { username: req.session.user.username },
                    { $set: { username: new_userID } }
                );
                req.session.user.username = new_userID;
            } else if (new_UserID.trim() === '') {
                // Update only the password
                await userCollection.updateOne(
                    { username: req.session.user.username },
                    { $set: { password: new_password } }
                )
                req.session.user.password = new_password;
            } else {
                // Update both username and password
                await userCollection.updateOne(
                    { username: req.session.user.username },
                    { $set: { username: new_UserID, password: new_password } }
                )
                req.session.user.username = new_UserID;
                req.session.user.password = new_password;
            };
            //update session
            res.redirect('/profile');
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

