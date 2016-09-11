const jwt = require('jwt-simple');
const userModel = require('./models/user-model.js');
const auth = {
    login: function(req, res) {
        const account = req.body.account || '';
        const password = req.body.password || '';

        if (account == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(account, password, function(err, user) {

            if (err) {
                res.status(500);
                res.json({
                    "status": 500,
                    "message": "Invalid service"
                });
                return;
            }
            if (!user) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "用户名或密码不正确"
                });
                return;
            } else {
                // If authentication is success, we will generate a token
                // and dispatch it to the client
                if (!user.status) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "用户被锁定"
                    });
                    return;
                }
                res.json(genToken(user));
            }
        });

    },

    validate: function(account, password, cb) {
        // spoofing the DB response for simplicity
        console.log('validate: ' + account + ',' + password);
        userModel.checkLogin(account, password, cb);
        //return user;
    },

    validateUser: function(account) {
        // spoofing the DB response for simplicity
        var dbUserObj = { // spoofing a userobject from the DB. 
            name: 'arvind',
            role: 'admin',
            account: 'arvind@myapp.com'
        };
       return userModel.findOne({account:account,status:true});
        //return dbUserObj;
    },
}

// private method
function genToken(user) {

    const expires = expiresIn(7); // 7 days
    const token = jwt.encode({
        exp: expires
    }, require('./config/config.js').secret);
    delete user.password;
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    const dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
