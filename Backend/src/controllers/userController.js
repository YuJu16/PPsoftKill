const User = require("../models/userModel");
const {AppError} = require("../utils/error");
const mongoose = require("mongoose");
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetUsersWithPaginationController = async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1)* limit;

    const users = await User.find({})
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    const totalUsers = await User.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
        success:true,
        message:"list of users",
        page:page,
        totalPages : totalPages,
        count: users.length,
        users: users
    })
    
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const ModifyUserRoleController = async (req, res)=>{
    const {role}= req.body;
    if (req.user._id.toString() == req.params.id.toString()){
        throw new AppError("You are not allowed to change your own role", 403);
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid user id", 400);
    }

    const user = await User.findById(req.params.id);
    if(!user){
        throw new AppError("cannot process user", 500);
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
        success:true,
        message:"user's role modified successfully",
        user
    });
} 


module.exports = {
    GetUsersWithPaginationController,
    ModifyUserRoleController
}