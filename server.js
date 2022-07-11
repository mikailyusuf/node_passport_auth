require('dotenv').config()
const { request } = require('express');
const express= require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const password = require('./auth/passport')
const jwt = require('jsonwebtoken');

const db = require('./model/');
const passport = require('passport');
const User = db.User;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/login',async (req,res)=>{
    const {email,password} = req.body
    const userWithEmail = await User.findOne({where:{email}}).catch((err)=>{
        console.log("Error ",err)
    })

    if(!userWithEmail){
        return res.status(401).json({message:"User does not exist"});
    }

    const hash = userWithEmail.password;

    bcrypt.compare(password, hash, function(err, result) {
        if(!result){
            return res.status(401).json({message:"Email or password does not exist"});
        }else{
            const jwtToken  = jwt.sign({id:userWithEmail.id,email:userWithEmail.email},process.env.JWT_SECRET);
            return res.json({message:"Success",token:jwtToken})
        }
    });  
});

app.use(express.json());


app.post('/register',async (req,res)=>{
    const password = await hashPassword(req.body.password)
    console.log(`User hashed password == ${password}] `)
    let info = {
        username:req.body.username,
        password:password,
        email:req.body.email,
        phone_number:req.body.phone_number
    }

    const user = await User.create(info);
    res.status(201).send(user);
});

app.get('/secret',passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.send("Secrets endpoint");
});


app.listen(PORT,(req,res)=>{
console.log(`Server running on port ${PORT}`);
});

async function hashPassword(password){
    const hash = bcrypt.hash(password,10);
    return hash
}