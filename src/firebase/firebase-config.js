import admin from 'firebase-admin';
import serviceAccount from './clanit-e903d-firebase-adminsdk-wnrln-95e51dd8ee.json'; 
//var admin = require("firebase-admin");

//var serviceAccount = require("./julla-tutorial.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: "https://sample-project-e1a84.firebaseio.com"
})

module.exports.admin = admin