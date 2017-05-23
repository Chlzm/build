const validator = require('validator');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = {
  User: {
    username:{ type:String, required:true,unique: true},
    password:{ type:String, required:true },
    email:{
      type: String,
      validate: [ validator.isEmail, '请输入正确的邮件地址' ]
    }
  },

  Template: {
    userId: { type:ObjectId, ref:'User' },
    createAt: { type:Date, default:Date.now },
    activity: { type:Object },
    products1: { type:Array },
    products2: { type:Array },
    banners: {type:Array},
    modelType: { type:String },
    status: {type: Number,default: 1}
  }
}
