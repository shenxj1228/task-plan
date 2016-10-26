const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const TaskSchema = new Schema({
  taskName: { type: String, required: true },
  taskDesc: { type: String,default:''},
  dealAccount: { type: String,required:true },
  userName:{type:String,required:true},
  dh:{type:String},
  planStartTime:{type:Date},
  planEndTime:{type:Date},
  realStartTime:{type:Date},
  realEndTime:{type:Date},
  weight:{type:Number,default:1},
  rate:{type:Number,default:0},
  type:{type:Number,default:0},
  remark:{type:String},
  status:{type:Boolean,default:true},
  createAccount:{type:String},
  createTime:{type:Date,default: Date.now},
  projectId:{type:String},
  projectName:{type:String}
});


module.exports = mongoose.model('Task', TaskSchema);