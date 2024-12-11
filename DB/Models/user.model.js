const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullName : {type:String , required:true},
    email: {type:String , required:true , unique:true},
    password : {type:String , required:true},
    currentPlan : {type:String},
    isVerified:{type:Boolean , default:false},
    vc:{type:Number}
},{
    timestamps:true
})


userSchema.pre('save' , async function(next){
    this.password = await bcrypt.hash(this.password , parseInt(process.env.SALTS))
    next()
})


const User =  mongoose.model('user' , userSchema);


module.exports = User;