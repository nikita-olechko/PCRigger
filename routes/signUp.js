var express = require('express');
router = express.Router();

module.exports = function (app, userCollection, saltRounds, Joi, bcrypt) {
    app.get('/signup', (req, res) => {
        res.render('sign up')
    })

    app.post('/signup', async (req, res) => {
        const {
            username,
            password
        } = req.body;

        // Validate input
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(20).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });
        const validationResult = schema.validate({
            username,
            password
        });
        if (validationResult.error) {
            res.status(400).send(`Invalid username or password. <a href="/">Go back to home</a>`);
            return;
        }

        // Check if username already exists
        const existingUser = await userCollection.findOne({
            username: username
        });
        if (existingUser) {
            res.status(409).send(`Username already exists. <a href="/">Go back to home</a>`);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        var newDate = new Date();
        // Create new user
        const newUser = {
            username: username,
            password: hashedPassword,
            user_type: 'user',
            createdAt: newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()
        };
        await userCollection.insertOne(newUser);

        // Log in user
        req.session.user = newUser;

        // Redirect to members area
        res.redirect('/');
    });
    
}
