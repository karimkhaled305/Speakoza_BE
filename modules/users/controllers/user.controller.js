const User = require('../../../DB/Models/user.model')
const { sendVerificationEmail } = require('./emailVerification');
const jwt = require('jsonwebtoken') ;
const bcrypt = require('bcrypt')

const createUser = async (req,res)=>{

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    try {
        const {fullName, email , password} = req.body;
        const checkEmail = await User.findOne({email})
        if(checkEmail){
            res.status(500).json({message : 'user is already registered !!'})
        }else{
    
            const newUser = new User({fullName , email  , password})
            const savedUser = await newUser.save();
            const sendEmail = await sendVerificationEmail(email , verificationCode)
            if(sendEmail){
                storeVC = await User.findOneAndUpdate({email} , {vc:verificationCode})
            }
            res.status(200).json({message: ' user created successfully , verification code sent' , savedUser})
           
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'error creating user' ,error})
    }
   
}

const checkVerification = async (req,res)=>{
    const {vercode} = req.body;
    const {id} = req.params;
    const foundedUser = await User.findById({_id:id})
    if(foundedUser){
        if(foundedUser.vc==vercode){
            await User.findOneAndUpdate({_id:id} , {isVerified:true})
            res.status(200).json({message:'user verified successfully !'})
        }else {
            res.status(500).json({message:'verification code is incorrect'})
        }
    }else{

        res.status(500).json({message:'something error cannot find user or id is incorrect'})
    }
}


const login = async (req,res)=>{
    const {email , password} = req.body; 

    const foundedUser = await User.findOne({email})
    if(!foundedUser){
        res.status(500).json({message:'user is not exist'})
    }else {
        bcrypt.compare(password , foundedUser.password, (err, result)=>{
        if(result){
            var token = jwt.sign({id:foundedUser._id , name:foundedUser.fullName}, process.env.JWTKEY)
            res.status(200).json({message:'Welcome Mr'+' ' + foundedUser.fullName , token})
          }else{
            res.status(500).json({message:'password is incorrect' , err})
          }
      });
      
    }

}


module.exports = {createUser,checkVerification , login};