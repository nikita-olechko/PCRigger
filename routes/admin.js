var express = require('express');
router = express.Router();

module.exports = async function (app, userCollection) {

    function isAdmin(req) {
        if (req.session.user.user_type == 'admin') {
            return true;
        }
        return false;
    }

    function adminAuthorization(req, res) {
        if (!isAdmin(req)) {
            res.status(403);
            res.render("notAuthorized");
            return false;
        }
        else {
            return true;
        }
    }

    function isValidSession(req) {
        console.log("checking session")
        if (req.session.user) {
            return true;
        }
        return false;
    }

    app.get('/admin', async (req, res) => {
        if (!isValidSession(req)) {
            res.redirect('/login');
            return;
        }
        console.log("checking admin")
        userIsAdmin = adminAuthorization(req, res);
        console.log("admin: " + userIsAdmin)
        if (userIsAdmin) {
            console.log("admin found")
            const result = await userCollection.find({}).toArray();
            res.render('admin', { user: req.session.user, users: result });
        }
    });

}
