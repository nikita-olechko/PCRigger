var express = require('express');
router = express.Router();

module.exports = function (app) {
    app.get('/', (req, res) => {
        let buttons = [];
        if (req.session.user) {
            //assign buttons to be displayed
            buttons = [
                { route: 'signOut', description: 'Sign out' },
                { route: 'members', description: 'Members Area' }
            ];
        }
        else {
            buttons = [
                { route: 'signup', description: 'Sign up' },
                { route: 'login', description: 'Log in' }
            ];
        }
        res.render('landing_page', { buttons: buttons });
    });
};

