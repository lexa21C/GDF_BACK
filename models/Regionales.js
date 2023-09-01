var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Regional = Schema({
    _id:String,
    name: String,
},{
    timestamps : true,
    versionKey: false
})


module.exports = mongoose.model('Regionales', Regional)