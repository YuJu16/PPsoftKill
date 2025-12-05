const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const POST_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
}

const POST_CATEGORIES = {
    HIGH_TECH : "High-Tech",
    HOME:"Maison",
    FASHION : "Mode",
    HOBBIES: "Loisirs",
    OTHER:"Autre"
}

const postSchema = new mongoose.Schema({
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
    image:{
        type:String,
        trim:true,
        default: null
    },
    category:{
        type:String,
        trim:true,
        required:true,
        enum:Object.values(POST_CATEGORIES),
        default:POST_CATEGORIES.OTHER,
    },
    status:{
        type: String,
        enum:Object.values(POST_STATUS),
        required:true,
        default: POST_STATUS.PENDING,
    },
    temperature:{
        type: Number,
        required: true,
        default: 0,
    },
    authorId:{
        type: ObjectId,
        required:true,
        ref:"User",
    }
},{timestamps:true});

//postSchema.index({title:'text', description:'text'});
const Post = mongoose.model('Post', postSchema);
module.exports = {
    POST_STATUS,
    POST_CATEGORIES,
    Post
}

