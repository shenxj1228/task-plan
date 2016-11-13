const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JournalSchema = new Schema({
    account: { type: String, required: true },
    userName: { type: String, required: true },
    taskId: { type: String },
    taskName: { type: String },
    title: { type: String },
    log: { type: String },
    createAccount: { type: String },
    createTime: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Journal', JournalSchema);
