// Error handling middleware
function errorHandler(err, req, res, next) {
  let error = {
    error: true,
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
  };

  // Handle different types of errors
  if (err.name === "ValidationError") {
    error.statusCode = 400;
    error.message = "Validation Error: " + err.message;
  }

  if (err.name === "CastError") {
    error.statusCode = 400;
    error.message = "Invalid ID format";
  }

  if (err.code === "ENOENT") {
    error.statusCode = 404;
    error.message = "File not found";
  }
}

// Helper function to create custom errors
function createError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Async error wrapper to catch async errors
function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  createError,
  asyncErrorHandler,
};
