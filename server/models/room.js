const mongoose = require('mongoose')
const {Schema} = mongoose

const roomSchema = new Schema({
    roomId:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }

})

const Roommodel = mongoose.model('Room',roomSchema)

module.exports = Roommodel