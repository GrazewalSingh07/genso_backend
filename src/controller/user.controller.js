const express=require("express");
const router= express.Router();
const User=require("../model/user.model")
const jwt = require('jsonwebtoken');
require("dotenv").config()
const {body, validationResult}=require("express-validator")
 
const newToken=(user)=>{
    return jwt.sign({user},process.env.SECRET_KEY)
}


router.post("/register",

    body("username").not().isEmpty().withMessage("Please Enter Username"),
    
body("email").not().isEmpty().withMessage("Please enter email").isEmail().withMessage("Please enter valid email").custom(async(value)=>{
    let user= await User.findOne({email:value}).lean().exec()
    console.log(user)
    if(user){
       throw new Error("Email already exists")
    }
    return true
    
   }),
body("password").not().isEmpty().withMessage("Please enter password").custom((value)=>{
    
    let regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(!value.match(regex)||value.length<8){
                throw new Error("Password must be strong");
            }
         return true;
    
}), 
async(req,res)=>{
    try {
       
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).send({error:errors.array()})
        }
      
    
            const curr=await User.create(req.body)
            const token=newToken(curr)
            console.log(token)
            return res.status(200).send({curr,token})
        
        
       
    } catch (error) {
        if(error.code===11000){
           return res.status(500).send("Register successful please login")
        }
        return res.status(400).send(error)
        
    }
})


router.post("/login",
 body("email").not().isEmpty().withMessage("Please enter email").isEmail().withMessage("Please enter valid email")
 .custom(async(value)=>{
    let user= await User.findOne({email:value}).lean().exec()
    
    if(!user){
        throw new Error("User doesnot exist, Please register")
    }
    return true
 }).bail(),
 body("password").not().isEmpty().bail(),

 async(req,res)=>{
     try {
        const errors=validationResult(req)
         
        if(!errors.isEmpty()){
           return res.status(400).json({error:errors.array()})
        }


       let user= await User.findOne({email:req.body.email}).exec()
       
       const match=user.checkPassword(req.body.password)

       if(!match){
           return  res.status(400).send("Email or password incorrect")
       }

       const token=newToken(user)

       return res.status(200).send({user,token})
     } catch (error) {
        return res.status(500).send({error:error.message})
     }
     
 })



 

module.exports= router