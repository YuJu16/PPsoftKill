const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const DEAL_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
}

const DEAL_CATEGORIES = {
    HIGH_TECH : "High-Tech",
    HOME:"Maison",
    FASHION : "Mode",
    HOBBIES: "Loisirs",
    OTHER:"Autre"
}

const dealSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim:true,
        minlength: 5,
        maxlength: 100,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:10,
        maxlength:500,
    },
    price:{
        type:Number,
        required:true,
        default:0,
    },
    originalPrice:{
        type:Number,
        required:true,
        default:0,
    },
    url:{
        type:String,
        trim:true,
        maxlength:2048
    },
    category:{
        type:String,
        trim:true,
        required:true,
        enum:Object.values(DEAL_CATEGORIES),
        default:DEAL_CATEGORIES.OTHER,
    },
    status:{
        type: String,
        enum:Object.values(DEAL_STATUS),
        required:true,
        default: DEAL_STATUS.PENDING,
    },
    temperature:{
        type: Number,
        requireed : true,
        default: 0,
    },
    authorId:{
        type: ObjectId,
        required:true,
        ref:"User",
    }
},{timestamps:true});

//dealSchema.index({title:'text', description:'text'});
const Deal = mongoose.model('Deal', dealSchema);
module.exports = {
    DEAL_STATUS,
    DEAL_CATEGORIES,
    Deal
}