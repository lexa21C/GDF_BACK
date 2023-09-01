var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Formation_program_create = Schema({
    program_name: String,
    number_quarters: Number,
},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Formation_programs_create', Formation_program_create)