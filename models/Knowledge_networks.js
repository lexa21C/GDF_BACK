var mongoose = require('mongoose')
var Schema = mongoose.Schema


var Net_knowledge = Schema({
    knowledge_network: String,
    manager_name: String,
    advisor_name: String,
})

module.exports = mongoose.model('knowledge_networks', Net_knowledge)