var mongoose = require('mongoose')
var Schema = mongoose.Schema;


var Artiffact = Schema({
    name: String,
    description: String,
    // quarter: Number,
    competence: [{
        ref: "Competences",
        type: Schema.Types.String
    }],
    // formation_program: [{
    //     ref: "Formation_progrmas",
    //     type: Schema.Types.String
    // }],
    // project: [{
    //     ref: "Projects",
    //     type: Schema.Types.ObjectId
    // }],
    // learning_result: [{
    //     ref: "Learning_results",
    //     type: Schema.Types.String
    // }],
    quarter: [{
        ref: "Quarters",
        type: Schema.Types.ObjectId
        
    }]
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Artiffacts', Artiffact)