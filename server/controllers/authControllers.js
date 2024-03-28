const User = require('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')
const { json } = require('express')
const jwt = require('jsonwebtoken')
const Coderoom = require('../models/coderoom')
const Room = require('../models/room')
const Coding = require('../models/coding')





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









//Code execution end point
const codeexe = async (req,res)=>{
    try {
        const { code, roomId } = req.body;
        const newCode = new Code({ code, roomId });
        await newCode.save();
        res.status(201).json({ message: 'Code stored successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };


  
    




    
//room create end point    
const roomcreate = async (req, res) => {
        try {
          const { roomId, username, password } = req.body;
          
          // Check if the room already exists
          let existingRoom = await Room.findOne({ roomId });
          if (!existingRoom) {
            // Room doesn't exist, create a new room
            const newRoom = new Room({ roomId, username, password });
            await newRoom.save();
            res.status(201).json({ msg: "Room created successfully" });
          } else {
           
            if (password !== existingRoom.password) {
              return res.status(401).json({ msg: "Invalid password" });
            }
            res.status(200).json({ msg: "Joined existing room successfully" });
          }
        } catch (error) {
          console.error("Error creating/joining room:", error);
          res.status(500).json({ msg: "Server error" });
        }
};
      







//Save code end point
const savecode = async (req, res) => {
    try {
      const { code, id } = req.body;
  
      // Check if the user with the given ID already exists
      const existingCode = await Coding.findOne({ id });
  
      if (existingCode) {
        // If the user exists, update their code
        existingCode.code = code;
        await existingCode.save();
      } else {
        // If the user doesn't exist, create a new code document
        const newCode = new Coding({ code, id });
        await newCode.save();
      }
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving code:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
  







  const savecoderoom = async (req, res) =>{
    try {
        const { code , roomId } = req.body;
    
        // Check if the room ID exists in the database
        const existingCode = await Coderoom.findOne({ roomId });
        console.log(existingCode)
        // If room ID exists, update the code; otherwise, create new entry
        if (existingCode) {
          existingCode.code = code;
          await existingCode.save();
        } else {
          await Coderoom.create({ roomId, code });
        }
    
        // res.status(200).json({ message: 'Code saved successfully.' });
        res.json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save code.' });
      }
  }
  





module.exports={
    test,
    registerUser,
    loginUser,
    getProfile,
    codeexe,
    roomcreate,
    savecode,
    savecoderoom
}