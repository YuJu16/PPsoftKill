const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        trim: true,
        required:true,
        minlength:3,
        maxlength:350,
    },
    postId:{
        type:ObjectId,
        required:true,
        ref:"Post"
    },
    authorId:{
        type:ObjectId,
        required:true,
        ref:"User",
    }
},{timestamps:true});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;