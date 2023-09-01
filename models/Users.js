var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = Schema({
    complete_names: String,
    email: String,
    password: String,
    type_profile: [{
        ref: "Profiles",
        type: Schema.Types.ObjectId
    }],

    // thematic_lines: [{
    //     ref: "Thematic_lines",
    //     type: Schema.Types.String
    // }],

    formation_program: [{
        ref: "Formation_programs",
        type: Schema.Types.String
    }],

    training_center: [{
        ref: "Training_centers",
        type: Schema.Types.String
    }]


}, {
    timestamps : true,
    versionKey: false
})

User.methods.toJSON=function(){
    const {password,...user} = this.toObject()
    return user
}

module.exports = mongoose.model('Users', User)