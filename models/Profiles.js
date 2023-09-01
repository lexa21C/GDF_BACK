var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Profile = Schema({
    type_profile :  String
},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Profiles', Profile)