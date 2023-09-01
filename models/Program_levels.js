var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Programs_level = Schema({
    _id:String,
    program_level: String
})


module.exports = mongoose.model('Program_levels', Programs_level )