const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const TaskSchema = new Schema({
  taskName: { type: String, required: true },
  dealAccount: { type: String,required:true },
  userName:{type:String,required:true},
  planStartTime:{type:Date},
  planEndTime:{type:Date},
  realStartTime:{type:Date},
  realEndTime:{type:Date},
  weight:{type:Number},
  rate:{type:Number},
  type:{type:Number,default:0},
  status:{type:Boolean,default:true},
  createAccount:{type:String},
  createTime:{type:Date},
  projectId:{type:String}
});


module.exports = mongoose.model('Task', TaskSchema);