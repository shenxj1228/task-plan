const config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

const port = config.server.port;
const app = express();

const jwt = require('express-jwt');
require('./libraries/promisify-all')(['mongoose']);

mongoose.connect(config.mongo.url);
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');


    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.all('/api/*', [require('./middlewares/validateRequest')]);

app.use('/', routes);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(port, () => { console.log(`Magic happens on port ${port}`); });

module.exports = app;
