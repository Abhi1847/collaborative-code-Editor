const express = require('express')
const router = express.Router()
const cors = require('cors')
const {test, registerUser, loginUser, getProfile} = require('../controllers/authControllers')


//middleware
router.use(
    cors({
        credentials:true,
        origin: 'http://localhost:3000'
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.get('/editor', (req,res)=>{
    res.json("Welcome")
})


module.exports =router