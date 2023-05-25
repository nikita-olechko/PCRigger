var express = require('express');
router = express.Router();

module.exports = function (app, Joi, userCollection, saltRounds, bcrypt) {
    app.get('/email_confirm', (req, res) => {
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('email_confirm');
        }
    });

    app.post('/email_confirm', async (req, res) => {
        userEmail = req.body.email;


        const schema = Joi.object({
            userEmail: Joi.string().required(),
        });
        const valid_input = schema.validate({
            userEmail,
        });
        if (valid_input.error) {
            res.status(400).render('templates/notification_page.ejs', { message: 'Invalid Email.' });
            return;
        }
        else {
            const existingUser = await userCollection.findOne({
                email: userEmail
            });
            if (existingUser) {
                userData = existingUser;
                res.render('recovery_questions', { user: userData });

            }
            else {
                res.status(409).render('templates/notification_page.ejs', { message: 'Email does not correspond to any user.' });
                return;
            }
        }
    });

    app.post('/recovery_questions', async (req, res) => {
        var userData = JSON.parse(req.body.userData);
        security_answer_1 = req.body.security_answer_1;
        security_answer_2 = req.body.security_answer_2;
        security_answer_3 = req.body.security_answer_3;

        const schema = Joi.object({
            security_answer_1: Joi.string().required(),
            security_answer_2: Joi.string().required(),
            security_answer_3: Joi.string().required(),
        });
        const valid_input = schema.validate({
            security_answer_1,
            security_answer_2,
            security_answer_3,
        });
        if (valid_input.error) {
            res.status(400).render('templates/notification_page.ejs', { message: 'Invalid Security answers.' });
            return;
        }
        else {
            const security_answers = [security_answer_1, security_answer_2, security_answer_3];
            // Check if security answers match
            const matchingAnswers = security_answers.every((answer, index) => {
                const dbAnswer = userData[`security_answer_${index + 1}`];
                return bcrypt.compareSync(answer, dbAnswer);
            });
            if (matchingAnswers) {
                res.render('password_reset', { user: userData });
            } else {
                res.status(409).render('templates/notification_page.ejs', { message: 'Invalid Security answers.' });
                return;
            }
        }
    });

    app.post('/password_reset', async (req, res) => {
        var userData = JSON.parse(req.body.userData);
        new_password = req.body.new_password;
        confirm_password = req.body.confirm_password;
        const schema = Joi.object({
            new_password: Joi.string()
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{3,30}$/)
            .required(),
            confirm_password: Joi.string()
            .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{3,30}$/)
            .required(),
        });
        const valid_input = schema.validate({
            new_password,
            confirm_password
        });
        if (!valid_input.error) {
            if (new_password != confirm_password) {
                res.status(409).render('templates/notification_page.ejs', { message: 'Passwords do not match.' });
                return;
            }
            else {
                // Hash password
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(new_password, salt);
                await userCollection.updateOne({
                    email: userData.email
                }, {
                    $set: {
                        password: hashedPassword
                    }
                });
                res.render('templates/notification_page.ejs', { message: 'Your password has been reset.' });
                return;
            }
        }
        else {
            res.status(400).render('templates/notification_page.ejs', { message: 'Invalid format for Password.' });
            return;
        }
    });
};
