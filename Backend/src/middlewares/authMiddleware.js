const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { AppError } = require('../utils/error');

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId)=>{
    return jwt.sign(
        {userId: userId},
        JWT_SECRET,
        {expiresIn:'30d'}
    );
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const authenticateUser = async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new AppError("Authorization header missing or malformed", 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId)
        if (!user){
            throw new AppError("User not found", 401);
        }
        req.user = user;
        next();
    }
    catch(error){
        if (error.name == "TokenExpiredError"){
            throw new AppError("Token expired", 401);
        }

        if (error.name == "TokenExpiredError"){
            throw new AppError("Token expired", 401);
        }

        console.error("Authentication error:", error);
        throw new AppError("Error while verifying token", 500);
    }

}


const requiredRole = (requiredRole) =>{
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    return (req,res,next) =>{
        
        if(!req.user){
            throw new AppError("User not authenticated",401);
        }
        if(!req.user.hasRole(requiredRole)){
            throw new AppError("Insufficient permissions", 403);
        }
        next();
    };
};

const requireAnyRole = (allowedRoles) =>{
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    return (req,res,next) =>{
        if(!req.user){
            return res.status(401).json({message:"User not authenticated"});
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Insufficient permissions"});
        }
        next();
    }
}

const requirePermission = (action)=>{
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    return (req,res,next) =>{
        if(!req.user){
            throw new AppError("User not authenticated", 401);
        }
        if(!req.user.canPerform(action))    {
            throw new AppError("Insufficient permissions",403);
        }
        next();
    };
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const optionalAuthenticate = async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')){
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if(user){
                req.user = user;
            }
        }
        next();
    }catch(error){
        console.error("Optional auth error: ", error);
        next();
    }
}
module.exports = {
    generateToken,
    authenticateUser,
    requireAnyRole,
    requiredRole,
    requirePermission,
    optionalAuthenticate
}