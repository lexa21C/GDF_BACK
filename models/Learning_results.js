var mongoose = require('mongoose')

var Schema = mongoose.Schema

var Result = Schema({
    _id: String,
    learning_result: String,
    
    competence:[{
        res:"Competence",
        type: Schema.Types.String
    }],

},{
    timestamps : true,
    versionKey: false
})
module.exports = mongoose.model('Learning_results', Result)