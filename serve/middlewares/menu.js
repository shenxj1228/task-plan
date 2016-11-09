const RoleMenu = require('../config/roleMenu.js');
const userModel = require('../models/user-model.js');
const menu = {
    list: function(req, res) {
        userModel.findById(req.headers['x-key']).then(function(doc) {
            res.status(200).json({ menuList: RoleMenu[Math.ceil(parseInt(doc.role) / 10).toString()] });
        });
    }
}
module.exports = menu;
