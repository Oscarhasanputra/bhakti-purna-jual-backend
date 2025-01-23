// Basic configuration
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();


app.use(cors());
// Configure app to use bodyParser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// REGISTER ROUTES
var apiRouter = require('./core/routes')(app, express);
app.use(apiRouter);


// START THE SERVER
var server = app.listen(5000, function () {
    console.log('Server is running.. 5000');
});