var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Record = Schema({
    number_record: Number,
    start_date: String,
    finish_date: String,

    formation_program: [{
        ref: "Formation_programs",
        type: Schema.Types.String
    }],

    user: [{
        ref: "Users",
        type: Schema.Types.ObjectId
    }]
},{
    timestamps : true,
    versionKey: false
})


module.exports = mongoose.model('Records', Record)