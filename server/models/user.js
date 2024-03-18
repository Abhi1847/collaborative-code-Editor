const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String
})

const Usermodel = mongoose.model('User',userSchema)

module.exports = Usermodel