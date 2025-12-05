const {body, param} = require('express-validator');


const CommentValidation = [
    body("content")
    .trim()
    .notEmpty().withMessage("comment content required")
    .isLength({min:3,max:500}).withMessage("content size must be between 3 & 500 chars"),
];


module.exports = {
    CommentValidation
}