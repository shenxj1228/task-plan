const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    account: { type: String, required: true, unique: true },
    password: { type: String, default: '111111' },
    name: { type: String, required: true },
    role: { type: Number, default: 100 },
    status: { type: Boolean, default: true },
    avatar: { type: String, default: '/assest/images/avatar/default.png' },
    createAccount: { type: String, default: 'admin' },
    createTime: { type: Date, default: new Date('2012-12-12') }
});


module.exports = mongoose.model('User', UserSchema);
