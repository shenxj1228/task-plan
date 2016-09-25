const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    account: { type: String, required: true, unique: true },
    password: { type: String, default: '111111' },
    name: { type: String, required: true },
    role: { type: Number, default: 100 },
    status: { type: Boolean, default: true },
    avatar: { type: String, default: '/assets/images/avatar/default.jpg' },
    createAccount: { type: String, default: 'admin' },
    createTime: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
UserSchema.methods.changePassword = function(pwd) {
    var user = this;
    user.password = pwd;
    user.save();
}

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {

        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
        //cb(null,true);
    });
};

module.exports = mongoose.model('User', UserSchema);
