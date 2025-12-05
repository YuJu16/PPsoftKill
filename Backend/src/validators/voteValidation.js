const{body,param}= require("express-validator");
const {VOTE_TYPES} = require('../models/voteModel');


const VoteValidation =[
    body("type")
    .trim()
    .notEmpty().withMessage("'type' required to vote")
    .isString().withMessage("type must be a string")
    .isIn(Object.values(VOTE_TYPES)).withMessage(`Invalid category name, needs to be one of those values : ${Object.values(VOTE_TYPES).join(', ')}`),
];


module.exports = {
    VoteValidation,
};