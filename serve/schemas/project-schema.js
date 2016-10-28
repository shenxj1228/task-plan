const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const ProjectSchema = new Schema({
  projectName: { type: String, required: true,unique: true},
  rate: { type: Number,required:true },
  isActive:{type:Boolean,default:false},
  createAccount:{type:String},
  createTime:{type:Date,default: Date.now}
});


module.exports = mongoose.model('Project', ProjectSchema);
