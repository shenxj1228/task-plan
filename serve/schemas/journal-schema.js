const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JournalSchema = new Schema({
    title: { type: String,required: true },
    log: { type: String ,required: true},
    journalTime:{ type: Date, default: Date.now },
    userName: { type: String },
    createAccount: { type: String },
    createTime: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Journal', JournalSchema);
