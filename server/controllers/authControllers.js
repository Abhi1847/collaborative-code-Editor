const User = require('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')
const { json } = require('express')
const jwt = require('jsonwebtoken')

//Home page endpoint
const test = (req,res)=>{
    res.json('Test is Working')
}


//Register page endpoint
const registerUser =  async (req,res)=>{
    try {
        const {name, email, password} = req.body;

        //check name was enter or not
        if(!name){
            return res.json({
                error:'Name is require'
            })
        }

        //check password is enter or not
        if(!password || password < 6){
            return res.json({
                error:'Password is require ans should be at least 6 characters long'
            })
        }

        //check email
        const exist = await User.findOne({email})
        if(exist){
            return res.json({
                error:'Email is already taken'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({
            name, 
            email, 
            password:hashedPassword,
        })

        return res.json(user)

    } catch (error) {
        console.log(error)
    }
}  


//Login page endpoint
const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body

        //check user is exist
        const user = await User.findOne({email})
        
        if(!user){
            return res.json({
                error:'No user Found'
            })
        }
        
        const match = await comparePassword(password , user.password)
        
        if(match){
            jwt.sign({ email: user.email, id: user._id, name: user.name} , process.env.JWT_SECRET, {}, (err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json(user)
            })
        }else{
            res.json({
                error:'Password is not matched'
            })
        }
    } catch (error) {
        console.log(error)
    }
}


//getProfile endpoint
const getProfile = (req,res)=>{
const {token}= req.cookies
if(token){
    jwt.verify(token,process.env.JWT_SECRET, {}, (err,user)=>{
        if(err) throw err
        res.json(user)
    })
}else{
    res.json(null)
}
}

module.exports={
    test,
    registerUser,
    loginUser,
    getProfile
}