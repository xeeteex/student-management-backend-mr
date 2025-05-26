/**
 * Error handling middleware for Express
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  console.error(err.stack);

  // Set default status code
  error.statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.name === 'CastError') {
    // Mongoose bad ObjectId
    error.message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = 'Validation failed';
    error.errors = messages;
    error.statusCode = 400;
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Not authorized, token failed';
    error.statusCode = 401;
  }

  // JWT Expired
  if (err.name === 'TokenExpiredError') {
    error.message = 'Token has expired';
    error.statusCode = 401;
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(error.errors && { errors: error.errors })
  });
};

export default errorHandler;
