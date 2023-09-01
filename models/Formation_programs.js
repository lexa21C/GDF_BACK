var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Formation_program = Schema({
    _id:String,
    program_name: String,
    number_quarters: Number,
    total_duration:String,
    Program_version:String,
    competence : [{
        ref: "Competences",
        type: mongoose.Schema.Types.Number,
    }],

    program_level:{
        ref:'Program_levels',
        type:mongoose.Schema.Types.String,
    },
    thematic_line: {
       ref: 'Thematic_lines',
       type: mongoose.Schema.Types.String,
    }
    // user : [{
    //     ref: "Users",
    //     type: mongoose.Schema.Types.ObjectId,
    // }]
},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Formation_programs', Formation_program)