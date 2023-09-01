var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Quarter = Schema({
    number:Number,

    competence: [{
        ref: "Competences",
        type: Schema.Types.String
    }],
    // artiffact:[{
    //     ref:"Artiffacts",
    //     type:Schema.Types.ObjectId
    // }],
    formation_program: [{
        ref: "Formation_progrmas",
        type: Schema.Types.String
    }],
}, { 
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Quarters', Quarter)
