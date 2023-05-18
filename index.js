require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const saltRounds = 12;
const Joi = require('joi');
const bcrypt = require('bcrypt');

require('./utils.js');


app.set('view engine', 'ejs');

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

var {
  database
} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

app.use(express.urlencoded({
  extended: false
}));
// use public folder for static files
app.use(express.static('public'));
//Setting the view engine to ejs
app.set('view engine', 'ejs');


var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true`,
  crypto: {
    secret: mongodb_session_secret
  }
})

app.use(session({
  secret: node_session_secret,
  store: mongoStore,
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
  }
}));

// Delete this later....

// app.get('/', (req, res) => {
//   res.render('index');
// });
require('./routes/landing_page')(app);

require('./routes/sampleRoute')(app);

require('./routes/signUp')(app, userCollection, saltRounds, Joi, bcrypt);

require('./routes/login')(app, userCollection, Joi, bcrypt);

require('./routes/admin')(app, userCollection);

require('./routes/profile')(app, Joi, bcrypt, saltRounds);

require('./routes/signOut')(app);

require('./routes/partsListPage')(app);

require('./routes/searchPartFunction')(app);

require('./routes/partsCategoryPage')(app);

require('./routes/specsPage')(app, userCollection);

require('./routes/configurator')(app, userCollection);

require('./routes/specificBuildInfo')(app, userCollection);

require('./routes/members')(app);

require('./routes/info')(app);

require('./routes/partsComparison')(app);

require('./routes/prebuiltOptions.js')(app);

require('./routes/email_confirm')(app, Joi, userCollection, saltRounds, bcrypt);

<<<<<<< HEAD

app.get("*", (req, res) => {
  res.status(404);
  res.render('404');
})
=======
require('./routes/404')(app);
>>>>>>> 978feeac3c1c5d71d4e6f58e7cbdba8ddb80a441


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});