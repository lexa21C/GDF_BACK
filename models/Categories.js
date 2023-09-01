var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Categorie = Schema({
    name: String,
},{
    timestamps : true,
    versionKey: false
})

module.exports = mongoose.model('Categories', Categorie)