const { AppError } = require('../utils/error');
const {DEAL_STATUS,Deal, DEAL_CATEGORIES} = require('../models/dealModel');
const ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
}
const mongoose = require('mongoose');
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetDealsController = async (req , res ) =>{
    let filter = {status:DEAL_STATUS.APPROVED}
    
    if(req.user){
        const user = req.user;
        if(user.role.toString() == ROLES.ADMIN){
            filter = {};
        }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1)* limit;


    const deals = await Deal.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .populate("authorId").exec();
    if (!deals){
        throw new AppError("Can't Process deals", 404);
    }
    
    const totalDeals = await Deal.countDocuments(filter);
    const totalPages = Math.ceil(totalDeals / limit);


    return res.status(200).json({
        success: true,
        deals,
        totalDeals,
        totalPages
    })
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetPendingDealsController = async (req, res)=>{
    const deals = await Deal.find({status: DEAL_STATUS.PENDING}).populate('authorId').exec();
    if (!deals){
        throw new AppError("Can't Process deals", 404);
    }

    return res.status(200).json({
        success:true,
        message:"list of pending deals",
        deals
    });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const SearchDealsController = async (req,res) =>{
    
    const query = req.query.q;
    if (!query){
        throw new AppError("query 'q' not found or empty", 400);
    }

    const filter = {};
    filter.status = DEAL_STATUS.APPROVED;
    
    filter.$or = [
        {title:{$regex: query, $options : 'i'}},
        {description:{$regex: query, $options:'i'}}
    ];
    
    const deals = await  Deal.find(filter).sort({createdAt:-1}).populate('authorId').exec();
    if(!deals){
        throw new AppError("deals not found", 404);
    }
    
    return res.status(200).json({
        success: "true",
        deals
    })
};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetDealByIdController = async (req,res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("Invalid id format", 400);
    }

    const deal = await Deal.findById(req.params.id).populate("authorId").exec();
    if(!deal){
        throw new AppError("Can't find deal", 404);
    }

    return res.status(200).json({
        success: true,
        message:"deal found successfully",
        deal
    })


};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const AddDealController = async (req,res) =>{
    const user = req.user;
    if (!user){
        throw new AppError("User not found", 403);
    }

    const {title,description,price,originalPrice,url,category}= req.body;

    if(!title || !description){
        throw new AppError("title or description or both not found", 400);
    }

    const deal = new Deal({
        title,
        description,
    });

    if (price){
        deal.price = price;
    }

    if(originalPrice){
        deal.originalPrice  = originalPrice;
    }

    if(url){
        deal.url = url;
    }
    if(category){
        deal.category = category;
    }

    deal.authorId = user._id;

    await deal.populate('authorId');

    await deal.save();



    return res.status(201).json({
        success: true,
        message: "Deal created successfully",
        deal
    })
    
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const ModifyDealByIdController = async (req,res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("User not found", 403);
    }

    const {title,description,price,originalPrice,url,category} = req.body;
    if(!title && !description && !price && !originalPrice && !! url && !category){
        throw new AppError("you need at least one element to modify on the deal");
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("Invalid id format", 400);
    }

    const deal = await Deal.findById(req.params.id).populate("authorId").exec();

    if(!deal){
        throw new AppError("deal not found", 404);
    }

    if(deal.authorId.toString() !== user._id.toString() && user.role.toString() !== ROLES.ADMIN){
        throw new AppError("You are not allowed to modify this deal", 403);
    }

    if(deal.status === DEAL_STATUS.APPROVED){
        throw new AppError("you are not allowed to modify this deal because it has been already approved", 403)
    }

    if(title){
        deal.title = title;
    }

    if(description){
        deal.description = description;
    }

    if(price){
        deal.price = price;
    }

    if(originalPrice){
        deal.originalPrice = originalPrice;
    }

    if (url){
        deal.url = url;
    }
    if(category){
        deal.category = category;
    }

    await deal.save();

    return res.status(200).json({
        success:true,
        message:"deal modified successfully",
        deal
    });


};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const DeleteDealByIdController = async (req,res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("User not found", 403);
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("Invalid id format", 400);
    }
    const deal = await Deal.findById(req.params.id);
    if(deal.authorId.toString() != user._id.toString() && user.role != ROLES.ADMIN ){
        throw new AppError("You are not allowed to delete this post");
    }

    await deal.deleteOne();
    
    return res.status(200).json({
        success:true,
        message:"Deal deleted successfully",
    });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const ModerateDealController = async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid deal id");
    }
    
    const deal = await Deal.findById(req.params.id).populate('authorId').exec();
    if(!deal){
        throw new AppError("can't process deal");
    }

    const {status}= req.body;
    deal.status = status;

    deal.save();
    return res.status(200).json({
        success : true,
        message:"deal moderated successfully",
        deal
    });
};


module.exports = {
    GetDealsController,
    SearchDealsController,
    GetDealByIdController,
    AddDealController,
    ModifyDealByIdController,
    DeleteDealByIdController,
    GetPendingDealsController,
    ModerateDealController
    
}