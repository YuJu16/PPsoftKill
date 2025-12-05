const {Vote,VOTE_TYPES} = require('../models/voteModel');
const {Post} = require('../models/postModel');
const mongoose = require("mongoose");
const {AppError} = require('../utils/error');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const VoteController = async (req,res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("User not found", 403);
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid id format", 400);
    }
    const post = await Post.findById(req.params.id);
    if (!post){
        throw new AppError("Post not found",404);
    }

    const {type} = req.body;
    
    const vote = await Vote.findOne({userId : user._id, postId : post._id}).populate("userId").populate('postId').exec();
    if(vote){

        if(type == VOTE_TYPES.HOT && vote.type != VOTE_TYPES.HOT){
        post.temperature++;
        }else if (type == VOTE_TYPES.COLD && vote.type != VOTE_TYPES.COLD){
            post.temperature--;
        }

        vote.type = type;


        

        await post.save();
        await vote.save();

        await vote.populate('userId postId');


        return res.status(200).json({
            success:true,
            message:"voted successfully",
            vote
        })
    }

    const newVote = new Vote({
        userId : user._id,
        postId : post._id,
        type:type,
    });


    if(type == VOTE_TYPES.HOT){
        post.temperature++;
    }else{
        post.temperature--;
    }

    await post.save();

    await newVote.save();

    await newVote.populate("userId postId");
    


    return res.status(200).json({
        success:true,
        message: "voted successfully",
        newVote
    });


}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */

const RemoveVote = async (req, res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("User not found", 403);
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid id format", 400);
    }
    const post = await Post.findById(req.params.id);
    if (!post){
        throw new AppError("Post not found",404);
    }
    const vote = await Vote.findOne({userId :user._id, postId: post._id});
    if(!vote){
        throw new AppError("vote not found",404);
    }

    if(vote.type == VOTE_TYPES.COLD){
        post.temperature ++;
    }else{
        post.temperature--;
    }

    await vote.deleteOne();
    await post.save();

    return res.status(200).json({
        success:true,
        message:"vote removed successfully"
    })
    
};


module.exports = {
    VoteController,
    RemoveVote
}