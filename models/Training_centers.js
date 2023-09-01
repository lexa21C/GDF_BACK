var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Training_center = Schema({
    _id: String,
    regionale:[{
        ref:'Regionales',
        type:Schema.Types.String
    }],
    training_center: String,
    center_direction: String,
    telephone_center:String,
    email_center: String,
    vice_principal: String,
    contact_vice_principal: String,
    
},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Training_centers', Training_center)