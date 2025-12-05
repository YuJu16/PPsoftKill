const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const VOTE_TYPES = {
    HOT:"hot",
    COLD:"cold"
};

const voteSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:Object.values(VOTE_TYPES),
        required: true,
    },
    userId:{
        type:ObjectId,
        ref:"User",
        required:true,
    },
    dealId:{
        type:ObjectId,
        ref:"Deal",
        required:true,
    }
},{timestamps:true});


const Vote = mongoose.model("Vote", voteSchema);

module.exports = {
    VOTE_TYPES,
    Vote
};