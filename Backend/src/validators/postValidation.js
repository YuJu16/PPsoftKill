const {body, param, query} = require('express-validator');
const {POST_CATEGORIES} = require('../models/postModel');


const VALID_POST_CATEGORIES_VALUES = Object.values(POST_CATEGORIES);

const CreatePostValidation = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title required")
    .isLength({min:5,max:100}).withMessage("Title size must be between 5 & 100 chars"),

    body("description")
    .trim()
    .notEmpty().withMessage("Description required")
    .isLength({min:10,max:500}).withMessage("Description size must be between 10 & 500 chars"),

    body("price")
    .optional()
    .isFloat({min:0}).withMessage("Price must be 0 or higher"),

    body("originalPrice")
    .optional()
    .isFloat({min:0}).withMessage("originalPrice must be 0 or higher"),


    body("category")
    .default("Autre")
    .trim()
    .isString().withMessage("Category must be a string")
    .isIn(VALID_POST_CATEGORIES_VALUES).withMessage(`Invalid category name, needs to be one of those values : ${VALID_POST_CATEGORIES_VALUES.join(', ')}`),

    body("url")
    .optional()
    .trim()
    .isLength({max:2048}).withMessage("Url length too long, must be under 2048 chars"),
    
];

const SearchPostValidation = [
    query("q")
    .trim()
    .notEmpty().withMessage("query 'q' required")
    .isLength({min:1}).withMessage("query must not be empty")
];

const ModifyPostValidation = [
    body("title")
    .optional()
    .trim()
    .isLength({min:5,max:100}).withMessage("Title size must be between 5 & 100 chars"),

    body("description")
    .optional()
    .trim()
    .isLength({min:10,max:500}).withMessage("Description size must be between 10 & 500 chars"),

    body("price")
    .optional()
    .isFloat({min:0}).withMessage("Price must be 0 or higher"),

    body("originalPrice")
    .optional()
    .isFloat({min:0}).withMessage("originalPrice must be 0 or higher"),


    body("category")
    .optional()
    .trim()
    .isString().withMessage("Category must be a string")
    .isIn(VALID_POST_CATEGORIES_VALUES).withMessage(`Invalid category name, needs to be one of those values : ${VALID_POST_CATEGORIES_VALUES.join(', ')}`),

    body("url")
    .optional()
    .trim()
    .isLength({max:2048}).withMessage("Url length too long, must be under 2048 chars"),
    
    
];


module.exports ={
    CreatePostValidation,
    SearchPostValidation,
    ModifyPostValidation
};

