var express = require('express');
router = express.Router();

module.exports = async function (app) {
    // Clear the user session and redirect to home page
    app.get('/signOut', (req, res) => {
        req.session.user = null;
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.redirect('/');
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
            return;
        });
    });
};
