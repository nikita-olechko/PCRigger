var express = require('express');
router = express.Router();

module.exports = function (app, Joi, userCollection, saltRounds, bcrypt) {
    let tempUser = null;
    app.get('/email_confirm', (req, res) => {
        if (req.session.user) {
            res.redirect('/');
        } else {
        res.render('email_confirm');
        }
    })

    app.post('/email_confirm', async (req, res) => {
        email = req.body.email;

        
        const schema = Joi.object({
            email: Joi.string().required(),
            // security_answer_1: Joi.string().required(),
            // security_answer_2: Joi.string().required(),
            // security_answer_3: Joi.string().required(),
            // new_password: Joi.string().required()
        })
        const valid_input = schema.validate({
            email,
        });
        if (valid_input.error) {    
            res.status(400).send(`Invalid email. <a href="/">Go back to home</a>`);
            return;
        }
        else {
            const existingUser = await userCollection.findOne({
                email: email
            });
            if (existingUser) {
                console.log(existingUser);
                tempUser = existingUser;
                res.render('recovery_questions', { user: tempUser });
            
            }
            else {
                res.status(409).send(`Email does not correspond to any user. <a href="/">Go back to home</a>`);
                return;
            }
        }
    })

    app.post('/recovery_questions', async (req, res) => {
        security_answer_1 = req.body.security_answer_1;
        security_answer_2 = req.body.security_answer_2;
        security_answer_3 = req.body.security_answer_3;

        const schema = Joi.object({
            security_answer_1: Joi.string().required(),
            security_answer_2: Joi.string().required(),
            security_answer_3: Joi.string().required(),
        })
        const valid_input = schema.validate({
            security_answer_1,
            security_answer_2,
            security_answer_3,
        });
        if (valid_input.error) {
            res.status(400).send(`Invalid security answers. <a href="/">Go back to home</a>`);
            return;
        }
        else {
            const security_answers = [security_answer_1, security_answer_2, security_answer_3];
            const matchingAnswers = security_answers.every((answer, index) => {
                const dbAnswer = tempUser[`security_answer_${index + 1}`];
                return bcrypt.compareSync(answer, dbAnswer);
            });       
            if (matchingAnswers) {
                res.render('password_reset');
            } else {
                res.status(409).send(`Incorrect security answers. <a href="/">Go back to home</a>`);
                return;
            }
        }
    })

    app.post('/password_reset', async (req, res) => {
        new_password = req.body.new_password;
        const schema = Joi.object({
            new_password: Joi.string().required()
        })
        const valid_input = schema.validate({
            new_password
        });
        if (valid_input.error) {
            res.status(400).send(`Invalid password. <a href="/">Go back to home</a>`);
            return;
        }
        else {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(new_password, salt);
            await userCollection.updateOne({
                email: tempUser.email
            }, {
                $set: {
                    password: hashedPassword
                }
            });
            res.send(`Your password has been changed. <a href="/">Go back to home</a>`);
            return;
        }
    })
}


                // if (new_password) {
                //     const salt = await bcrypt.genSalt(saltRounds);
                //     const hashedPassword = await bcrypt.hash(new_password, salt);
                //     await userCollection.updateOne({
                //         email: email
                //     }, {
                //         $set: {
                //             password: hashedPassword
                //         }
                //     });
                //     res.redirect('/');
                //     return;
                // }