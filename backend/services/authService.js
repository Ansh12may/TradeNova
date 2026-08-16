const User = require("../models/UserModel.js");
const {hashPassword,comparePassword} = require("../utils/password.js");
const {generateToken} = require("../utils/jwt.js")

const registerUser = async({name,email,password})=>{

    const existingUser = await User.findOne({ email });
    if(existingUser){
        throw new error("User already exists");    
    }
    const hashedPassword = await hashPassword(password);
   

    const user = new User({
        name,
        email,
        password:hashedPassword
    })
    await user.save();
    return user;

}


const loginUser = async({email,password})=>{
    const user = await User.findOne({ email });

    if (!user) {
    throw new Error("Invalid credentials");
    }
    const isPasswordValid = await comparePassword( password,user.password)
    if (!isPasswordValid) {
    throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);
    return {
        user,
        token,

    };
};


module.exports = {
  registerUser,loginUser

};