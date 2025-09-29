const errorHandler = (err, req, res, next) => {
  // Use the response's status code if it's already set, otherwise default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  // It's better to have a single response structure
  // The switch statement is often unnecessary if you just use the status code
  // set in the controller before throwing the error.

  res.status(statusCode);

  res.json({
    title: err.name,
    message: err.message,
    // Only show the stack trace in development mode for security
    stackTrace: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;