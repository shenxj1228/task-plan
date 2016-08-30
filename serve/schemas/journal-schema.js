const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const JournalSchema = new Schema({
  date: { type: Date, required: true },
  taskId: { type: String,required:true },
  taskName:{type:String,required:true},
  account:{type:String},
  userName:{type:String},
  rate:{type:Number},
  log:{type:String},
  createAccount:{type:String},
  createTime:{type:Date}
});


module.exports = mongoose.model('Journal', JournalSchema);
