// PACKAGES
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    config = require('./config'),    
    morgan = require('morgan');

//HELPERS
const crawler_helper = require('./helpers/crawler');


// MORGAN LOGGING THE CALLS
app.use(morgan('dev'));

// CONFIGURATION
server.listen(config.port);

crawler_helper.launch_crawler();
