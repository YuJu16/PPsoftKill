const { logger } = require('../utils/logger');
const { AppError } = require('../utils/error');

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl}`, err);
  
  const statusCode = err.statusCode || 500;
  
  const response = {
    success: false,
    message: err.message || 'Erreur interne du serveur',
    timestamp: err.timestamp || new Date().toISOString()
  };
  
  if (err.isValidationError && err.errors) {
    response.errors = err.errors;
    response.errorsCount = err.errors.length;
  }
  
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.method} ${req.originalUrl} non trouvée`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};