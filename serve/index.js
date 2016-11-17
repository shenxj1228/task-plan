const config = require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');

const port = config.server.port;
const app = express();

const userModel = require('./models/user-model.js');

const qpm = require('query-params-mongo');
const mongodb = require('mongodb');

const processQuery = qpm({
    autoDetect: [{ fieldPattern: /_id$/, dataType: 'objectId' }, { fieldPattern: /Time$/, dataType: 'date' }],
    converters: { objectId: mongodb.ObjectID }
});

app.use('/avatar',express.static(path.join(__dirname, 'avatars')));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

//初始化管理员账户
userModel.findOne({ account: 'admin' }).then(user => {
    if (!user) {
        userModel.create({ account: 'admin', password: '111111', name: '管理员', role: 1 });
    }
});

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

module.exports = app;
