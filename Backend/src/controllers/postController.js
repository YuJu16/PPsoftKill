const { AppError } = require('../utils/error');
const {POST_STATUS,Post, POST_CATEGORIES} = require('../models/postModel');
const ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
}
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetPostsController = async (req , res ) =>{
    let filter = {status:POST_STATUS.APPROVED}
    
    if(req.user){
        const user = req.user;
        if(user.role.toString() == ROLES.ADMIN){
            filter = {};
        }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1)* limit;


    const posts = await Post.find(filter)
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)
    .populate("authorId").exec();
    if (!posts){
        throw new AppError("Can't Process posts", 404);
    }
    
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);


    return res.status(200).json({
        success: true,
        posts,
        totalPosts,
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
const GetPendingPostsController = async (req, res)=>{
    const posts = await Post.find({status: POST_STATUS.PENDING}).populate('authorId').exec();
    if (!posts){
        throw new AppError("Can't Process posts", 404);
    }

    return res.status(200).json({
        success:true,
        message:"list of pending posts",
        posts
    });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const SearchPostsController = async (req,res) =>{
    
    const query = req.query.q;
    if (!query){
        throw new AppError("query 'q' not found or empty", 400);
    }

    const filter = {};
    filter.status = POST_STATUS.APPROVED;
    
    filter.$or = [
        {title:{$regex: query, $options : 'i'}},
        {description:{$regex: query, $options:'i'}}
    ];
    
    const posts = await  Post.find(filter).sort({createdAt:-1}).populate('authorId').exec();
    if(!posts){
        throw new AppError("posts not found", 404);
    }
    
    return res.status(200).json({
        success: "true",
        posts
    })
};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetPostByIdController = async (req,res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("Invalid id format", 400);
    }

    const post = await Post.findById(req.params.id).populate("authorId").exec();
    if(!post){
        throw new AppError("Can't find post", 404);
    }

    return res.status(200).json({
        success: true,
        message:"post found successfully",
        post
    })


};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const AddPostController = async (req,res) =>{
    const user = req.user;
    if (!user){
        throw new AppError("User not found", 403);
    }

    const {title,description,price,originalPrice,url,category}= req.body;

    if(!title || !description){
        throw new AppError("title or description or both not found", 400);
    }

    const post = new Post({
        title,
        description,
    });

    if (price){
        post.price = price;
    }

    if(originalPrice){
        post.originalPrice  = originalPrice;
    }

    if(url){
        post.url = url;
    }
    if(category){
        post.category = category;
    }

    // Gérer l'image si elle est uploadée
    if(req.file){
        post.image = req.file.filename;
    }

    post.authorId = user._id;

    await post.populate('authorId');

    await post.save();



    return res.status(201).json({
        success: true,
        message: "Post created successfully",
        post
    })
    
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const ModifyPostByIdController = async (req,res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("User not found", 403);
    }

    const {title,description,price,originalPrice,url,category} = req.body;
    if(!title && !description && !price && !originalPrice && !url && !category && !req.file){
        throw new AppError("you need at least one element to modify on the post");
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("Invalid id format", 400);
    }

    const post = await Post.findById(req.params.id).populate("authorId").exec();

    if(!post){
        throw new AppError("post not found", 404);
    }

    if(post.authorId.toString() !== user._id.toString() && user.role.toString() !== ROLES.ADMIN){
        throw new AppError("You are not allowed to modify this post", 403);
    }

    if(post.status === POST_STATUS.APPROVED){
        throw new AppError("you are not allowed to modify this post because it has been already approved", 403)
    }

    if(title){
        post.title = title;
    }

    if(description){
        post.description = description;
    }

    if(price){
        post.price = price;
    }

    if(originalPrice){
        post.originalPrice = originalPrice;
    }

    if (url){
        post.url = url;
    }
    if(category){
        post.category = category;
    }

    // Gérer le remplacement de l'image
    if(req.file){
        // Supprimer l'ancienne image si elle existe
        if(post.image){
            const oldImagePath = path.join(__dirname, '../../uploads', post.image);
            if(fs.existsSync(oldImagePath)){
                fs.unlinkSync(oldImagePath);
            }
        }
        post.image = req.file.filename;
    }

    await post.save();

    return res.status(200).json({
        success:true,
        message:"post modified successfully",
        post
    });


};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const DeletePostByIdController = async (req,res) =>{
    const user = req.user;
    if(!user){
        throw new AppError("User not found", 403);
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("Invalid id format", 400);
    }
    const post = await Post.findById(req.params.id);
    if(post.authorId.toString() != user._id.toString() && user.role != ROLES.ADMIN ){
        throw new AppError("You are not allowed to delete this post");
    }

    // Supprimer l'image associée si elle existe
    if(post.image){
        const imagePath = path.join(__dirname, '../../uploads', post.image);
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
        }
    }

    await post.deleteOne();
    
    return res.status(200).json({
        success:true,
        message:"Post deleted successfully",
    });
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const ModeratePostController = async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        throw new AppError("invalid post id");
    }
    
    const post = await Post.findById(req.params.id).populate('authorId').exec();
    if(!post){
        throw new AppError("can't process post");
    }

    const {status}= req.body;
    post.status = status;

    post.save();
    return res.status(200).json({
        success : true,
        message:"post moderated successfully",
        post
    });
};


module.exports = {
    GetPostsController,
    SearchPostsController,
    GetPostByIdController,
    AddPostController,
    ModifyPostByIdController,
    DeletePostByIdController,
    GetPendingPostsController,
    ModeratePostController
    
}

