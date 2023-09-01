var mongoose = require('mongoose')
var Schema = mongoose.Schema

var thematic_line = Schema({
    _id: String,
    thematic_line: String,
    thematic_line_description: String,
    formation_program: [{
        ref: "Formation_programs",
        type: Schema.Types.String
    }],
})

module.exports = mongoose.model('Thematic_lines', thematic_line)    
