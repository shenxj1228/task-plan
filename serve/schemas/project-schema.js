const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const ProjectSchema = new Schema({
  projectName: { type: String, required: true },
  rate: { type: Number,required:true },
  createAccount:{type:String},
  createTime:{type:Date}
});


module.exports = mongoose.model('Project', ProjectSchema);
