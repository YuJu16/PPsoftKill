const {Vote,VOTE_TYPES} = require('../models/voteModel');
const {Deal} = require('../models/dealModel');
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
    const deal = await Deal.findById(req.params.id);
    if (!deal){
        throw new AppError("Deal not found",404);
    }

    const {type} = req.body;
    
    const vote = await Vote.findOne({userId : user._id, dealId : deal._id}).populate("userId").populate('dealId').exec();
    if(vote){

        if(type == VOTE_TYPES.HOT && vote.type != VOTE_TYPES.HOT){
        deal.temperature++;
        }else if (type == VOTE_TYPES.COLD && vote.type != VOTE_TYPES.COLD){
            deal.temperature--;
        }

        vote.type = type;


        

        await deal.save();
        await vote.save();

        await vote.populate('userId dealId');


        return res.status(200).json({
            success:true,
            message:"voted successfully",
            vote
        })
    }

    const newVote = new Vote({
        userId : user._id,
        dealId : deal._id,
        type:type,
    });


    if(type == VOTE_TYPES.HOT){
        deal.temperature++;
    }else{
        deal.temperature--;
    }

    await deal.save();

    await newVote.save();

    await newVote.populate("userId dealId");
    


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
    const deal = await Deal.findById(req.params.id);
    if (!deal){
        throw new AppError("Deal not found",404);
    }
    const vote = await Vote.findOne({userId :user._id, dealId: deal._id});
    if(!vote){
        throw new AppError("vote not found",404);
    }

    if(vote.type == VOTE_TYPES.COLD){
        deal.temperature ++;
    }else{
        deal.temperature--;
    }

    await vote.deleteOne();
    await deal.save();

    return res.status(200).json({
        success:true,
        message:"vote removed successfully"
    })
    
};


module.exports = {
    VoteController,
    RemoveVote
}