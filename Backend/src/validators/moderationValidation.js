const {body, param} = require('express-validator');
const ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
}

const validStatus = {
    APPROVED : "approved",
    REJECTED: "rejected"
};

const ModerateDealValidation = [
    body("status").
    notEmpty().withMessage("status required")
    .isString().withMessage("type must be a string")
    .isIn(Object.values(validStatus)).withMessage(`Invalid status , needs to be one of those values : ${Object.values(validStatus).join(', ')}`)
];

const ModerateUsersValidation =[
    body("role")
    .notEmpty().withMessage("role required")
    .isString().withMessage("role must be type of string")
    .isIn(Object.values(ROLES)).withMessage(`Invalid status , needs to be one of those values : ${Object.values(ROLES).join(', ')}`)
];


module.exports = {
    ModerateDealValidation,
    ModerateUsersValidation
};