const admin = require('firebase-admin');
const serviceAccount = require('./onepage-serviceAccountKey.json');
const schedule = require('node-schedule');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const request = require('request');
const document = new JSDOM().window.document;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://onepage-1ca8f.firebaseio.com"
});
const db = admin.firestore();
console.log(new Date().toString());
console.log("Starting update...");
