var mongoose = require('mongoose');
mongoose.promise = global.promise;
var Schema = mongoose.Schema;
var models = require('./models');
let moment = require('moment');

//mongoose 分页插件  https://github.com/edwardhotchkiss/mongoose-paginate
var mongoosePaginate = require('mongoose-paginate');
var templateSchema =  new Schema(models.Template);
// templateSchema.virtual('formatTime').get(function(){
//   return moment(this.createAt).format('YYYY-MM-DD');
// })
templateSchema.path('createAt').get(function (v) {
    return moment(v).format('YYYY-MM-DD HH:MM')
})
templateSchema.set('toJSON', { getters: true});
templateSchema.plugin(mongoosePaginate);
var db = require('../config/db');
mongoose.connect(db);
mongoose.model('User',new Schema(models.User));
mongoose.model('Template',templateSchema);
global.Model = function(type){
    return mongoose.model(type);
}
