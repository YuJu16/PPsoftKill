const {body, param} = require('express-validator');
const {DEAL_CATEGORIES} = require('../models/dealModel');


const VALID_DEAL_CATEGORIES_VALUES = Object.values(DEAL_CATEGORIES);

const CreateDealValidation = [
    body("title")
    .trim()
    .notEmpty().withMessage("Title required")
    .isLength({min:5,max:100}).withMessage("Title size must be between 5 & 100 chars"),

    body("description")
    .trim()
    .notEmpty().withMessage("Description required")
    .isLength({min:10,max:500}).withMessage("Description size must be between 10 & 500 chars"),

    body("price")
    .notEmpty().withMessage("price required")
    .isFloat({min:0}).withMessage("Price must be 0 or higher"),

    body("originalPrice")
    .notEmpty().withMessage("originalPrice required")
    .isFloat({min:0}).withMessage("originalPrice must be 0 or higher"),


    body("category")
    .default("Autre")
    .trim()
    .isString().withMessage("Category must be a string")
    .isIn(VALID_DEAL_CATEGORIES_VALUES).withMessage(`Invalid category name, needs to be one of those values : ${VALID_DEAL_CATEGORIES_VALUES.join(', ')}`),

    body("url")
    .trim()
    .isLength({max:2048}).withMessage("Url length too long, must be under 2048 chars"),
    
];

const SearchDealValidation = [
    body("search")
    .trim()
    .notEmpty().withMessage("search needed")
    .isLength({min:1}).withMessage("search must not be empty")
];

const ModifyDealValidation = [
    body("title")
    .trim()
    .isLength({min:5,max:100}).withMessage("Title size must be between 5 & 100 chars"),

    body("description")
    .trim()
    .isLength({min:10,max:500}).withMessage("Description size must be between 10 & 500 chars"),

    body("price")
    .notEmpty().withMessage("price required")
    .isFloat({min:0}).withMessage("Price must be 0 or higher"),

    body("originalPrice")
    .isFloat({min:0}).withMessage("originalPrice must be 0 or higher"),


    body("category")
    .default("Autre")
    .trim()
    .isString().withMessage("Category must be a string")
    .isIn(VALID_DEAL_CATEGORIES_VALUES).withMessage(`Invalid category name, needs to be one of those values : ${VALID_DEAL_CATEGORIES_VALUES.join(', ')}`),

    body("url")
    .trim()
    .isLength({max:2048}).withMessage("Url length too long, must be under 2048 chars"),
    
    
];


module.exports ={
    CreateDealValidation,
    SearchDealValidation,
    ModifyDealValidation
};