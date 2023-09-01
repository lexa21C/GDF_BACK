const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Modules = Schema({
    path : String,
    name : String,
    icon : String,
    element : String,
    layout : String,
    auth : String,
    sidebar : String
})

module.exports = mongoose.model('Modules', Modules)


