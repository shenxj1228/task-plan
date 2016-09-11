const config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

const port = config.server.port;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('tiny'));

require('./libraries/promisify-all')(['mongoose']);

mongoose.connect(config.mongo.url);
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , X-Access-Token,X-Key,X-limit,X-offset,X-sortType');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');


    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});


app.all('/api/*', [require('./middlewares/validateRequest')]);
app.use('/', routes);



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(port, () => { console.log(`Magic happens on port ${port}`); });

module.exports = app;
