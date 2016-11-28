const config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

const port = config.server.port;
const app = express();

const user = require('./middlewares/user.js');
const project = require('./middlewares/project.js');

const qpm = require('query-params-mongo');
const mongodb = require('mongodb');

const schedule = require('node-schedule');

const processQuery = qpm({
    autoDetect: [{ fieldPattern: /_id$/, dataType: 'objectId' }, { fieldPattern: /Time$/, dataType: 'date' }],
    converters: { objectId: mongodb.ObjectID }
});

app.use('/avatar', express.static(path.join(__dirname, 'avatars')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(helmet());
app.use(morgan('tiny'));

require('./libraries/promisify-all')(['mongoose']);
mongoose.Promise = global.Promise;
try {
    mongoose.connect(config.mongo.url);
} catch (e) {
    console.log(e);
}
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , X-Access-Token,X-Key,X-Count,X-State');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

user.createAdmin();

app.all('/api/*', function(req, res, next) {
    req.query = processQuery(req.query);
    next();
});

app.all('/api/*', [require('./middlewares/validateRequest')]);
app.use('/', routes);



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(port, () => { console.log(`Magic happens on port ${port}`); });

//每日17:25对所有未完成项目进度统计
var j = schedule.scheduleJob('0 25 17 * * *', function() {
    project.updateRate();
    console.log('项目进度更新!');
});


module.exports = app;
