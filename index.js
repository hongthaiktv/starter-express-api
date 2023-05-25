const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const domain = 'https://onepage.cyclic.app';
const admin = require('firebase-admin');
const { JSDOM } = require('jsdom');
const request = require('request');
const path = require('path');
const document = new JSDOM().window.document;



/*
const { createWorker } = require('tesseract.js');

const worker = createWorker({ 
  //logger: m => console.log(m)
});

(async () => {
  await worker.load();
  await worker.loadLanguage('vie');
  await worker.initialize('vie');
  const { data: { text } } = await worker.recognize(path.join(__dirname, 'img.png'));
  console.log(text.match(/[0-9]{5}/g));
  await worker.terminate();
})();
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const token = "5161768feb4d724ef66d6f72aca3a3bd0f5f82a935fcc6d23041e4f6f6f7bfc7fa7e2d2839de9aa1b880d58e529fa6d7fc348f5c48fd0f699068323b9078cc8ac4ef5dab4a6a894bc9c58e1b5791602b4aa345d9ca994daa441fe80c419635435538d81fe8f675e2564ffa2483a0ee4f580da319f602bd33dff198991c2c79dc";

const APPSETTING = {serviceAccount: {}};
var db;

function dateUTC7() {
    let now = Date.now() + (7 * 60 * 60 * 1000);
    return new Date(now).toUTCString() + "7";
}
console.log(dateUTC7());

try {
    APPSETTING.serviceAccount = require('./onepage-serviceAccountKey.json');
    serverInit(APPSETTING.serviceAccount.firebase);
    /*
    console.log('Uploading API config to AWS...');
    s3Put(APPSETTING.serviceAccount, 'API/serviceAccountKey.json').then(result => {
	serverInit(APPSETTING.serviceAccount.firebase);
    }); */
} catch(err) {
    console.log('Loading API config...');
    s3Get('API/serviceAccountKey.json').then(result => {
	APPSETTING.serviceAccount = result;
	serverInit(APPSETTING.serviceAccount.firebase);
    });
}


async function s3Put(file, path) {
    const AWS = require("aws-sdk");
    const s3 = new AWS.S3();
    let upload = await s3.putObject({
	ContentType: 'application/json',
	Body: JSON.stringify(file, null, 2),
        Bucket: "cyclic-desert-sand-barnacle-shoe-ap-northeast-1",
        Key: path
    }).promise();
    console.log('Upload to AWS S3 Server success.');
    return upload;
}

async function s3Get(path) {
    const AWS = require("aws-sdk");
    const s3 = new AWS.S3();
    let file =  await s3.getObject({
        Bucket: "cyclic-desert-sand-barnacle-shoe-ap-northeast-1",
        Key: path
    }).promise();
    file = JSON.parse(file.Body.toString());
    console.log(`Get file **${path}** success.`);
    return file;
}

function serverInit(serviceAccount) {
    admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://onepage-1ca8f.firebaseio.com"
    });
    db = admin.firestore();
    app.listen(PORT, () => {
	console.log(`Web Server running at ${domain}:${PORT}`);
	updateAll();
	setInterval(() => updateAll(), 1 * 60 * 60 * 1000);
    });
}

function parseImg(imageUrl, regExp) {
    return new Promise(function(resolve, reject) {
const options = {
  method: 'POST',
  url: 'https://api.ocr.space/parse/image',
  headers: {
    'Content-Type': 'multipart/form-data',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0'
  },
  strictSSL: false,
  formData: {
    apikey: APPSETTING.serviceAccount.ocr,
    url: imageUrl,
    language: 'vie',
    scale: 'true',
    isTable: 'true',
    OCREngine: '3',
    detectOrientation: 'true'
  }
};

request(options, function (error, response, body) {
  if (error) return reject(new Error(error));
  const result = JSON.parse(body);

  if (result.IsErroredOnProcessing) {
    reject(new Error(result.ErrorMessage));
  } else {
    const regText = result.ParsedResults[0].ParsedText.match(regExp);
    resolve(regText);
  }
    });
  });
}


app.get('/', (req, res) => {
        res.send(`<!DOCTYPE html>
                      <html lang='en'>
                        <head>
			    <meta charset="utf-8" />
			    <meta name="viewport" content="width=device-width" />
                            <title>Onepage Update Center</title>
                        </head>
                        <body>
                            <h1 style="text-align:center;">Onepage Update Center</h1>
                            <h3>This page only for Administrator. Please contact for further support. Thanks!</h3>
                            <br>
                            <p>If you seeing this page it mean everything ok.</p>
			    <script>
				console.info('Welcome to update center!');
			    </script>
                        </body>
                      </html>`);
      });

app.get('/update', (req, res) => {
        if (true) {
                updateAll().then((result) => {
                        res.send(`<!DOCTYPE html>
                      <html lang='en'>
                        <head>
			    <meta charset="utf-8" />
			    <meta name="viewport" content="width=device-width" />
                            <title>Onepage Update Server</title>
                        </head>
                        <body>
                            <h1 style="text-align:center;">Onepage Update Center</h1>
                            <h5>${result}</h5>
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
      
function updateHTML(url, query, counter) {
        return new Promise(function(resolve, reject) {
                if (counter) ++counter.counter;
                var retry = 0;
                tryLoading();
                function tryLoading() {
                        request({
                                url: url,
                                headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0",
    "Cache-Control": "no-cache, no-store"
				},
                                strictSSL: false
                        },
                        function (error, response, body) {
                                if (error) reject(error);
                                else if (response.statusCode === 200) {
                                        let dom = new JSDOM(body);
                                        let doc = dom.window.document;
                                        let resultHTML = doc.querySelectorAll(query);
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
		console.log();
                console.log(new Date(dateUTC7).toUTCString() + "7");
                console.log("---------- Starting update ----------");
                finalResolve += new Date(dateUTC7).toUTCString() + "7" + "<br>";
                var counter = {counter: 0};
                var objUpdate = {timestamp: admin.firestore.FieldValue.serverTimestamp()};
                var cdate = new Date(Date.now() + 7 * 60 * 60 * 1000).getUTCDate();
                var docPath = "home/" + cdate;
                updateHTML("https://kqxs.vn/", "table#result_3", counter).then((result) => {
	let objResult = {
	    group: 'Tổng hợp',
	    html: result[0].outerHTML,
	    image: 'images/ve-so-vinh-long.jpg',
	    order: 2,
	    title: 'Kết quả xổ số'
	};
	checkCounter("kqxs", objResult);
    }).catch((error) => {errorCounter(error)});
                updateHTML("https://www.sacombank.com.vn/company/Pages/ty-gia.aspx", ".table", counter).then((result) => {	
	let objResult = {
	    group: 'Tổng hợp',
	    html: result[0].outerHTML,
	    image: 'images/money-exchange-001.jpg',
	    order: 4,
	    title: 'Tỷ giá USD và G7'
	};
	checkCounter("tygia", objResult);
    }).catch((error) => {errorCounter(error)});
                updateHTML("https://www.sacombank.com.vn/company/Pages/ty-gia.aspx", ".table", counter).then((result) => {	
	let objResult = {
	    group: 'Tổng hợp',
	    html: result[2].outerHTML,
	    image: 'images/money-exchange-002.jpg',
	    order: 5,
	    title: 'Tỷ giá ngoại tệ khác'
	};
	checkCounter("tygia2", objResult);
    }).catch((error) => {errorCounter(error)});
                updateHTML("http://www.sjc.com.vn/giavang/textContent.php", "table", counter).then((result) => {
	result = result[0];
	let objResult = {
	    group: 'Tổng hợp',
	    html: '',
	    image: 'images/vang-mieng-sjc.jpg',
	    order: 3,
	    title: 'Bảng giá vàng SJC'
	};
	let frag = JSDOM.fragment("<thead><tr><th colspan='3'>B&#7843;ng gi&#225; v&#224;ng</th></tr></thead>"); 
	result.insertBefore(frag, result.firstChild); 
	result.className = "table"; 
	result.querySelector("tbody").lastElementChild.remove();
	objResult.html = result.outerHTML;
	checkCounter("giavang", objResult);
    }).catch((error) => {errorCounter(error)});

//test
updateHTML("https://www.petrolimex.com.vn/ndi/thong-cao-bao-chi.html", "div.post-detail-list.category-thongcao > div");
updateHTML('https://www.petrolimex.com.vn/ndi/thong-cao-bao-chi/petrolimex-dieu-chinh-gia-xang-dau-tu-15-gio-00-phut-ngay-11-5-2023-1684740728-1239646330.html', 'div.entry-detail img');


               /*updateHTML("https://www.petrolimex.com.vn/ndi/thong-cao-bao-chi.html", "div.post-detail-list.category-thongcao > div", counter).then((result) => {
	console.log('1st request');
	for (const [index, ele] of Object.entries(result)) {
	    let anchor = ele.querySelector('h3 a');
	    let url = 'https://www.petrolimex.com.vn' + anchor.getAttribute('href');
	    let urlText = anchor.innerHTML;
	    if (/điều chỉnh giá xăng dầu/i.test(urlText)) {
		return updateHTML(url, 'div.entry-detail img');
	    }
	}
	throw 'Giá xăng: Not found relate article.';
    })
    .then(result => {
	console.log('2nd request');
		    let imgSrc = result[0].getAttribute('src');
	return parseImg(imgSrc, /\d+\.\d+/g);
    })
    .then(result => {
    let html = `
    <table class='table table-striped'>
	<thead>
	    <tr>
		<td>Mặt hàng</td><td>Đơn vị tính</td><td>Vùng 1</td><td>Vùng 2</td>
	    </tr>
	</thead>
	<tbody>
	    <tr>
		<td>Xăng RON 95-V</td><td>Đồng/lít</td><td>${result[0]}</td><td>${result[1]}</td>
	    </tr>
	    <tr>
		<td>Xăng RON 95-III</td><td>Đồng/lít</td><td>${result[2]}</td><td>${result[3]}</td>
	    </tr>
	    <tr>
		<td>Xăng sinh học E5 RON 92-II</td><td>Đồng/lít</td><td>${result[4]}</td><td>${result[5]}</td>
	    </tr>
	    <tr>
		<td>Điêzen 0,001S-V</td><td>Đồng/lít</td><td>${result[6]}</td><td>${result[7]}</td>
	    </tr>
	    <tr>
		<td>Điêzen 0,05S-II</td><td>Đồng/lít</td><td>${result[8]}</td><td>${result[9]}</td>
	    </tr>
	    <tr>
		<td>Dầu hoả 2 - K</td><td>Đồng/lít</td><td>${result[10]}</td><td>${result[11]}</td>
	    </tr>
	    <tr>
		<td>Mazút N<sup>o</sup>2B (3,0S)</td><td>Đồng/kg</td><td>${result[12]}</td><td>${result[13]}</td>
	    </tr>
	    <tr>
		<td>Mazút N<sup>o</sup>2B (3,5S)</td><td>Đồng/kg</td><td>${result[14]}</td><td>${result[15]}</td>
	    </tr>
	    <tr>
		<td>Mazút 180cst - 0,5S (RMG)</td><td>Đồng/kg</td><td>${result[16]}</td><td>${result[17]}</td>
	    </tr>
	</tbody>
    </table>`;

	let objResult = {
	    group: 'Tổng hợp',
	    html: html,
	    image: 'images/petrolimex.jpg',
	    order: 1,
	    title: 'Bảng giá xăng dầu'
	};

	checkCounter("giaxang", objResult);
    })
    .catch((error) => {errorCounter(error)});
*/
                console.log("Total update: " + counter.counter);
                finalResolve += "Total update: " + counter.counter + "<br>";
                function checkCounter(name, result) {
                        objUpdate[name] = result;
                        console.log("Update " + name + " finish.");
                        finalResolve += "Update " + name + " finish." + "<br>";
                        if (counter.counter === 1) {
                                db.doc(docPath).update(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {
                                        console.log("=>=> ::: Everything upto date ::: <=<=");
                                        finalResolve += "=>=> ::: Everything upto date ::: <=<=" + "<br>";
                                        resolve(finalResolve);
                                }).catch((error) => {
                                        if (error.code === 5) {
                                                db.doc(docPath).set(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {console.log("Set new data finish."); resolve("Set new data finish.");}).catch((error) => {console.log(error)});
                                        } else console.log(error);
                                });
                        } else {
                                --counter.counter;
                                console.log("Pending: " + counter.counter);
                                finalResolve += "Pending: " + counter.counter + "<br>";
                        }
                }
                function errorCounter(error) {
                        console.error(error);
			finalResolve += 'Error processing info.<br>';
                        if (counter.counter === 1) {
                                db.doc(docPath).update(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {
                                        console.log("=>=> ::: Everything upto date ::: <=<=");
                                        finalResolve += "=>=> ::: Everything upto date ::: <=<=" + "<br>";
                                        resolve(finalResolve);
                                }).catch((error) => {
                                        if (error.code === 5) {
                                                db.doc(docPath).set(objUpdate).then(() => db.doc("home/updatestatus").set({lastupdate: admin.firestore.FieldValue.serverTimestamp()})).then(() => {console.log("Set new data finish."); resolve("Set new data finish.");}).catch((error) => {console.log(error)});
                                        } else console.log(error);
                                });
                        } else {
                                --counter.counter;
                                console.log("Pending: " + counter.counter);
				finalResolve += 'Pending: ' + counter.counter + '<br>';
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
