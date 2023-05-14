const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
const domain = 'https://onepage.cyclic.app';

const admin = require('firebase-admin');
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const serviceAccount = require('./onepage-serviceAccountKey.json');
//const serviceAccount = JSON.parse(process.env.serviceAccountKey);
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const request = require('request');
const document = new JSDOM().window.document;

const token = "5161768feb4d724ef66d6f72aca3a3bd0f5f82a935fcc6d23041e4f6f6f7bfc7fa7e2d2839de9aa1b880d58e529fa6d7fc348f5c48fd0f699068323b9078cc8ac4ef5dab4a6a894bc9c58e1b5791602b4aa345d9ca994daa441fe80c419635435538d81fe8f675e2564ffa2483a0ee4f580da319f602bd33dff198991c2c79dc";

var apiKey =
{
  "type": "service_account",
  "project_id": "onepage-1ca8f",
  "private_key_id": "dcaa5d6bbe6f65ab7561403d00e0c645ccd16171",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/K0rtaTwjTHiM\n5VT9/ZKuTy8TDmMSq7vgO1fYjIBFrZq1Ei2qVOL8huKBkqJkY1qcSVx3MqmXgNVU\n2GC3yMUtYc8XGBQIennzL2ujlEAVvzTYNVWRZJkHdWAHEvcojLwX5R+0D2BJoZ3b\nbovAxEo+mKzfQtWuTxMVBRsZlkmt0ROWGCqDWqFzMZ3N2HELpnpjfAOaj17YZhcb\nC5n+3aKqPcpCdJf5QDH/kWzGAVzLwOtwBYdRJW35j80krvVta+Eb6ADuVdBV+rpI\nO28ar/jvGrTBeCkgiiw0LqIAfHFh2o+ZR3noTK5WWSECnYn9eDaaRtotwe/uEijw\nVJNPP47nAgMBAAECggEAVvuAWrjcy6TiXx2ECBNmN9jArxeHPboVQKhPxrDbNpkQ\nwR3V2GBKbaOEEXfiWvIYCu+YWoYbQ1uz9aiEjWsVSJpt63ChwN/VeDDV9bahWCPJ\njCzsU7zlok6mVGGtQu6SMP8oZznt0mLunCbXAO1vaL74PZe/+VFyech6dbB7stGa\nv4dU49Ar8jLSDr4vOjWs+p6jz6W3hLO1b+/hybCNNiKQLMG4aVmEBept00vfDhbk\nF/4CC6rYSK6ENDj5x5zADcROMBZkuMTDmunERbr8ceZAf6/xxvQEE4YO+cN1q5tE\nsf741fmOZLrdOsk0zLQ98YgZx/kDf6hdCRNSBuCenQKBgQDqwDtM0iMs+M/EldIF\nKEvx10zqReycmitpuO8gkAfDo50LtzX23La28lcefGQGWA9oNX+iVixwJqGWXp3m\nRwNow53xAtksgPdIV84tHdVtoPqjtlvQj33mUFZMsde13t/HcDsQ23VqRtiV8NSZ\nugi4ljfnMwyZy1xOiOhURcp1NQKBgQDQeSlQ5JfLIbkH+N4X/gLHw9BMwao0bsRL\nHSvJvH4HzHZXJMMkNlKaLD7nwVA5bkOM3KmZXdjLPsoqpTXZoWaQE/MhiYTDVDnV\nAQxlZGhp8eUixIM4XGOwexpPEUQDu3X06EX4Rzpx7pXHTxzAxaTGETo14sMlSjK8\nvk71Km1DKwKBgQDQz3MwDw9Y9m0haT7qdYCwOxngnZgtaHlLTkPujA9L96I/BJXM\n42DndMMHjBAREI2L3WKNzOc0TziWn80GQ46FxtMbybPSAVl0kR4FRa9OF846h4A+\nERUlI7rP97VvwjL9nRf9E6jqguAu54zEvRT61CwfzGnd92VBOkimhXnkLQKBgHvs\n6mCJ4qn/2+wfRnbgqmpxvmtCXJlalxlHt/XuNMUSB+75jX8DQ8seLi66PaRGJaWg\nrrjajrsTEj6TgxVh2oQfN9Jh2yf5837pZqMHMwJ3pwwp4Q8p7KDGLPd/ffzx/Maf\nJKjYPqfneeXG44K8epy7NO0/ZV3PY6XLQ0h99gGNAoGAIfJdue5DE38gPrM78rjt\noQ/fxRGytAjilhwyoIl1hLR2InO60DjIB8/aVUTRwLcpVTccx066yG1kvtSiRMuI\nqjx4ze21HAbd15cnDQxL/L2ZYgOIZcnX+kUVK+YSSzesMPTMt5K6HXnL2/WPDDOG\nrpKxC2bdIdeuCgaJRSz0h9Y=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-e48q9@onepage-1ca8f.iam.gserviceaccount.com",
  "client_id": "107727953277220894730",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e48q9%40onepage-1ca8f.iam.gserviceaccount.com"
};

async function s3Put(file, location) {
    await s3.putObject({
	ContentType: 'application/json',
	Body: JSON.stringify(file),
        Bucket: "cyclic-desert-sand-barnacle-shoe-ap-northeast-1",
        Key: location
    }).promise();
	console.log('Upload to AWS S3 Server success.');
}

s3Put(apiKey, 'API/serviceAccountKey.json');

async function s3Get(file) {
    let apiKey =  await s3.getObject({
	ContentType: 'application/json',
        Bucket: "cyclic-desert-sand-barnacle-shoe-ap-northeast-1",
        Key: file
    }).promise();
    console.log(apiKey);
    return apiKey;
}

s3Get('API/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://onepage-1ca8f.firebaseio.com"
});
const db = admin.firestore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
        res.send(`<!DOCTYPE html>
                      <html>
                        <head>
                            <title>Onepage Update Center</title>
                        </head>
                        <body>
                            <h1 style="text-align:center;">Onepage Update Center</h1>
                            <h3>This page only for Administrator. Please contact for further support. Thanks!</h3>
                            <br>
                            <p>If you seeing this page it mean everything ok.</p>
                        </body>
                      </html>`);
      });

app.get('/update', (req, res) => {
        if (true) {
                updateAll().then((result) => {
                        res.send(`<!DOCTYPE html>
                      <html>
                        <head>
                            <title>Onepage Update Server</title>
                        </head>
                        <body>
                            <h1 style="text-align:center;">Onepage Update Center</h1>
                            <h3>${result}</h3>
                        </body>
                      </html>`);
                      }).catch((err) => {
                        console.log(err);
                      });
        } else {
                console.log("invalid token");
                res.send("invalid token");
        }
});
      
app.listen(PORT, () => {
var dateUTC7 = Date.now() + (7 * 60 * 60 *1000);
console.log(new Date(dateUTC7).toUTCString() + "7");
console.log(`Starting server as ${domain}:${PORT}`);
});

function updateHTML(url, query, order, counter) {
        return new Promise(function(resolve, reject) {
                if (counter) ++counter.counter;
                var retry = 0;
                tryLoading();
                function tryLoading() {
                        request({
                                url: url,
                                headers: {"User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0"},
                                strictSSL: true
                        },
                        function (error, response, body) {
                                if (error) reject(error);
                                else if (response.statusCode === 200) {
                                        let dom = new JSDOM(body);
                                        let doc = dom.window.document;
                                        let resultHTML = doc.querySelectorAll(query)[order];
                                        if (resultHTML !== undefined) resolve(resultHTML);
                                        else reject("Not found query HTML: " + url);
                                } else {
                                        ++retry;
                                        if (retry < 4) {console.log("Retry " + retry + " times: " + url); tryLoading();}
                                        else reject("Error loading page: " + url);
                                }
                        });
                }
        });
}

function updateAll() {
        return new Promise(function(resolve, reject) {
                var finalResolve = "";
                var dateUTC7 = Date.now() + (7 * 60 * 60 *1000);
                console.log(new Date(dateUTC7).toUTCString() + "7");
                console.log("Starting update...");
                finalResolve += new Date(dateUTC7).toUTCString() + "7" + "<br>";
                var counter = {counter: 0};
                var objUpdate = {timestamp: admin.firestore.FieldValue.serverTimestamp()};
                var cdate = new Date(Date.now() + 7 * 60 * 60 * 1000).getUTCDate();
                var docPath = "home/" + cdate;
                updateHTML("https://www.xosobinhduong.com.vn/", ".table.table-hover.table-striped", 0, counter).then((result) => {checkCounter("kqxs", result)}).catch((error) => {errorCounter(error)});
                updateHTML("https://www.sacombank.com.vn/company/Pages/ty-gia.aspx", ".table", 0, counter).then((result) => {checkCounter("tygia", result)}).catch((error) => {errorCounter(error)});
                updateHTML("https://www.sacombank.com.vn/company/Pages/ty-gia.aspx", ".table", 1, counter).then((result) => {checkCounter("tygia2", result)}).catch((error) => {errorCounter(error)});
                updateHTML("http://www.sjc.com.vn/giavang/textContent.php", "table", 0, counter).then((result) => {let frag = JSDOM.fragment("<thead><tr><th colspan='3'>B&#7843;ng gi&#225; v&#224;ng</th></tr></thead>"); result.insertBefore(frag, result.firstChild); result.className = "table"; result.querySelector("tbody").lastElementChild.remove(); checkCounter("giavang", result);}).catch((error) => {errorCounter(error)});
                updateHTML("https://www.petrolimex.com.vn/", "#vie_p6_Container", 0, counter).then((result) => {checkCounter("giaxang", result)}).catch((error) => {errorCounter(error)});
                console.log("Total update: " + counter.counter);
                finalResolve += "Total update: " + counter.counter + "<br>";
                function checkCounter(name, result) {
                        objUpdate[name] = result.outerHTML;
                        console.log("Update " + name + " finish.");
                        finalResolve += "Update " + name + " finish." + "<br>";
                        if (counter.counter === 1) {
                                db.doc(docPath).update(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {
                                        console.log("Update finish.");
                                        finalResolve += "Update finish." + "<br>";
                                        resolve(finalResolve);
                                }).catch((error) => {
                                        if (error.code === 5) {
                                                db.doc(docPath).set(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {console.log("Set new data finish."); resolve("Set new data finish.")}).catch((error) => {console.log(error)});
                                        } else console.log(error);
                                });
                        } else {
                                --counter.counter;
                                console.log("Pending: " + counter.counter);
                                finalResolve += "Pending: " + counter.counter + "<br>";
                        }
                }
                function errorCounter(error) {
                        console.log(error);
                        if (counter.counter === 1) {
                                db.doc(docPath).update(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {
                                        console.log("Update finish.");
                                        resolve("Update finish.");
                                }).catch((error) => {
                                        if (error.code === 5) {
                                                db.doc(docPath).set(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {console.log("Set new data finish."); resolve("Set new data finish.");}).catch((error) => {console.log(error)});
                                        } else console.log(error);
                                });
                        } else {
                                --counter.counter;
                                console.log("Pending: " + counter.counter);
                        }
                }
        });
}

function updateKQXS() {
        var cdate = new Date(Date.now() + 7 * 60 * 60 * 1000).getUTCDate();
        var docPath = "home/" + cdate;
        updateHTML("https://www.xosobinhduong.com.vn/", ".table.table-hover.table-striped", 0).then((result) => {
                var objUpdate = {timestamp: admin.firestore.FieldValue.serverTimestamp(), kqxs: result.outerHTML};
                db.doc(docPath).update(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => console.log("Update kqxs finish."))
                .catch((error) => {
                        if (error.code === 5) {
                                db.doc(docPath).set(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {console.log("Set new data finish.")}).catch((error) => {console.log(error)});
                        } else console.log(error);
                });
        }).catch((error) => {console.log(error)});
}
