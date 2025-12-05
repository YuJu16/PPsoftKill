const {generateToken} = require('../middlewares/authMiddleware')
const User = require("../models/userModel");
const { AppError } = require('../utils/error');
const bcrypt = require("bcrypt");

const baseRegistredRole = "admin";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const registerController = async(req , res, next) =>{
    const {username,email, password, confirmPassword} = req.body;

    if(!username  ||!email || !password || !confirmPassword){
        throw new AppError("Invalid Input", 400);
    }

    if (password !== confirmPassword){
        throw new AppError("Invalid input", 400);
    }

    const existingUser = await User.findOne({$or: [{email},{username}]});
    if (existingUser){
        throw new AppError("User already existing", 409)
    }

    const role = baseRegistredRole;

    const user = new User({
        username,
        email,
        password,
        role,
    });
    await user.save();
    const jwtToken = generateToken(user.id)
    return res.status(201).json({
        message:"User saved successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        },
        token: jwtToken,
    });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const loginController = async(req, res, next) =>{
    const {username, password} = req.body;
    if (!username || !password){
        throw new AppError("Invalid input", 400)
    }

    const existingUser = await User.findOne({$or: [{email: username},{username: username}]}).select('+password');
    if (!existingUser){
        throw new AppError("incorrect email or password", 400)
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match){
        throw new AppError("incorrect email or password", 400);
    }

    const jwtToken = generateToken(existingUser.id);
    return res.status(200).json({
        success:true,
        message:"login successfull",
        user:{
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            bio:existingUser.bio,
            createdAt: existingUser.createdAt,
        },
        token: jwtToken,
    });
}


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const profileController = async(req,res,next) =>{
    const user = req.user;
    console.log(user);

    return res.status(200).json({
        success:true,
        message:"Your profile",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            bio:user.bio,
            role:user.role,
            createdAt: user.createdAt,
        },
    })
}




module.exports = {
    registerController,
    loginController,
    profileController
};