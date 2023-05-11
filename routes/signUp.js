var express = require('express');
router = express.Router();

module.exports = function (app, userCollection, saltRounds, Joi, bcrypt) {
    app.get('/signup', (req, res) => {
        res.render('sign up')
    })

    app.post('/signup', async (req, res) => {
        const {
            username,
            password,
            email,
            security_question_1,
            security_question_2,
            security_question_3,
            security_answer_1,
            security_answer_2,
            security_answer_3
        } = req.body;

        // Validate input
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(20).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            email: Joi.string().email().required(),
            security_answer_1: Joi.string().required(),
            security_answer_2: Joi.string().required(),
            security_answer_3: Joi.string().required()

        });
        const validationResult = schema.validate({
            username,
            password,
            email,
            security_answer_1,
            security_answer_2,
            security_answer_3
        });

        if (validationResult.error) {
            return res.render('sign up', {
                error: 'Invalid username or password or security answers. Please try again.'
            });
        }

        // Check if username already exists
        const existingUser = await userCollection.findOne({
            username: username
        });
        if (existingUser) {
            return res.render('sign up', {
                error: `Sorry, the username "${username}" is not available. Please choose another username.`,
                existingFields: {
                    username,
                    password,
                    email,
                    security_question_1,
                    security_question_2,
                    security_question_3,
                    security_answer_1,
                    security_answer_2,
                    security_answer_3
                }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const hashedAnswer1 = await bcrypt.hash(security_answer_1, saltRounds);

        const hashedAnswer2 = await bcrypt.hash(security_answer_2, saltRounds);

        const hashedAnswer3 = await bcrypt.hash(security_answer_3, saltRounds);



        var newDate = new Date();
        // Create new user
        const newUser = {
            username: username,
            password: hashedPassword,
            email: email,
            user_type: 'user',
            security_question_1: security_question_1,
            security_answer_1: hashedAnswer1,
            security_question_2: security_question_2,
            security_answer_2: hashedAnswer2,
            security_question_3: security_question_3,
            security_answer_3: hashedAnswer3,
            createdAt: newDate.toLocaleDateString() + " @ " + newDate.toLocaleTimeString()
        };
        await userCollection.insertOne(newUser);

        // Log in user
        req.session.user = newUser;

        // Redirect to members area
        res.redirect('/');
    });


}
