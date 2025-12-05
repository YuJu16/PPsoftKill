const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/error');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    
    const validationError = new ValidationError('Erreur de validation', extractedErrors);
    return next(validationError);
  }
  
  next();
};

module.exports = {
  validate
};