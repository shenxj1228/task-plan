var jwt = require('jwt-simple');
var validateUser = require('./auth').validateUser;
module.exports = function(req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method === 'OPTIONS') next();
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
    if (token && key) {

        try {
            var decoded = jwt.decode(token, require('../config/config.js').secret);
            if (decoded.exp <= Date.now()) {
                res.status(400)
                    .json({
                        "status": 400,
                        "message": "Token 过期了"
                    });
                return;
            }
            // Authorize the user to see if s/he can access our resources
           
            if (decoded.account && decoded.role) {
                if(decoded.role>10)
                    req.query.queryUser={account:decoded.account,role:decoded.role};
                next();
            } else {
                // No user with this name exists, respond back with a 401
                res.status(401)
                    .json({
                        "status": 401,
                        "message": "Token  was wrong"
                    });
                return;
            }
            // The key would be the logged in user's username

        } catch (err) {
            res.status(500)
                .json({
                    "status": 500,
                    "message": "Oops something went wrong",
                    "error": err
                });
        }
    } else {
        res.status(401)
            .json({
                "status": 401,
                "message": "Invalid Token or Key"
            });
        return;
    }
};
