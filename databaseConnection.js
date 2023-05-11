require('dotenv').config();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;

const MongoClient = require("mongodb").MongoClient;
// const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/Assignment1?retryWrites=true`;
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true`;
//mongodb+srv://PCRiggerBrian:OMGeR22ej4Q2Dmso@cluster0.j3mpk2d.mongodb.net/PCRigger?retryWrites=true

var database = new MongoClient(atlasURI, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = {database};