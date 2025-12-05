const Comment = require('../models/commentModel');
const {Post} = require('../models/postModel');
const {AppError} = require('../utils/error');
const mongoose = require('mongoose');

const ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetCommentsController = async (req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.postId)){
        throw new AppError("invalid postId format",400);
    }
    const comments = await Comment.find({postId:req.params.postId}).populate('authorId','username -_id' ).exec();
    if(!comments){
        throw new AppError("can't process comments",500);
    }

    return res.status(200).json({
        success:true,
        message:"list of comments",
        comments
    })

};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const AddCommentController = async (req, res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("user not found", 403);
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.postId)){
        throw new AppError("invalid postId format",400);
    }

    const {content} = req.body;

    const comment = new Comment({
        content:content,
        postId:req.params.postId,
        authorId: user._id
    });

    await comment.save();
    await comment.populate('authorId','username -_id' );

    return res.status(201).json({
        success:true,
        message:"comment added successfully",
        comment
    });


};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const ModifyCommentController = async (req, res)=>{
    const user = req.user;
    if(!user){
        throw new AppError("user not found ", 403);
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid comment id format",400);
    }

    const comment = await Comment.findById(req.params.id).populate('authorId', 'username -_id');
    if(!comment){
        throw new AppError("cannot proccess comment", 500);
    }

    if(user._id != comment.authorId && user.role != ROLES.MODERATOR && user.role != ROLES.ADMIN){
        throw new AppError("You are not allowed to modify this comment", 403);
    }

    const {content} = req.body;
    
    comment.content = content;

    await comment.save();

    return res.status(200).json({
        success:true,
        message:"comment modified successfully",
        comment
    });


    
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const DeleteCommentController = async(req,res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("user not found",403);
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid comment id format",400);
    }

    const comment = await Comment.findById(req.params.id);
    if(!comment){
        throw new AppError("cannot process comment", 500);
    }

    if(comment.authorId != user._id && user.role != ROLES.ADMIN){
        throw new AppError("You are not allowed to delete this comment", 403);
    }

    await comment.deleteOne();

    return res.status(200).json({
        success:true,
        message:"comment deleted successfully"
    })

};




module.exports = {
    GetCommentsController,
    AddCommentController,
    ModifyCommentController,
    DeleteCommentController
}

