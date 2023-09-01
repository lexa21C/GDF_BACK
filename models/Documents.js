var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Document = Schema({
    name: String,
    doc: Buffer,
    contentType: String,

    project: [{
        ref: "Projects",
        type: Schema.Types.ObjectId 
    }],

    artiffact: [{
        ref: "Artifacts",
        type: Schema.Types.ObjectId
        
    }]

},{
        timestamps : true,
        versionKey: false
    })

module.exports = mongoose.model('Documents', Document)