const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

global.appRoot = path.resolve(__dirname);

var router = express.Router();
var query = require('./routes/query');

var app = express();
console.log("Server running at http://127.0.0.1:8080/");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


http.createServer(app).listen(8080);

router.get('/', function(req, res) {
    res.send('Hello World');
})
router.get('/hw7', query.get);


app.use('/', router);
app.listen(5000);