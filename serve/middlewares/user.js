const fs = require('fs');
const path = require('path');
const UserModel = require('../models/user-model');
const avatarsPath=path.join(path.resolve(__dirname,'..') ,'avatars');
const user = {
    saveAvatar: function(req, res) {
        let base64Data = req.body.avatar || '';
        const userId = req.params.id || '';
        if (base64Data === ''  || userId === '') {
            res.status(500).json({
                "status": 500,
                "message": "上传的图片不存在或用户异常"
            });
        } else {
            base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
            fs.writeFile(path.join(avatarsPath, userId + '.png'), base64Data, 'base64', function(err) {
                if (err) {
                    res.status(500).json({
                        "status": 500,
                        "message": "保存图片失败"
                    });
                } else {
                    res.status(200).json({
                        "status": 200,
                        "message": "更换头像成功"
                    });
                }
            });
        }
    },
    getAvatar: function(req, res) {
        const userId = req.params.id || '';
        if (userId === '') {
            res.status(500).json({
                "status": 500,
                "message": "上传的图片不存在或用户异常"
            });
            return;
        }
        fs.exists(path.join(avatarsPath, userId + '.png'), function(exist) {
            if (!exist) {
                const defaultAvatar = path.join(avatarsPath, 'default/default.png');
                console.log(defaultAvatar);
                fs.exists(defaultAvatar, function(exist) {
                    if (!exist) {
                        res.status(500).json({
                            "status": 500,
                            "message": "默认头像图片不存在"
                        });
                    } else {
                        res.status(200).sendFile(defaultAvatar);
                    }
                });
            } else {
                res.status(200).sendFile(path.join(avatarsPath, userId + '.png'));
            }
        });


    }
}
module.exports = user;
