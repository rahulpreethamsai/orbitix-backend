const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// This middleware protects routes. It checks for a valid JWT in the request headers.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user associated with the token's ID and attach it to the request object.
      // We exclude the password from the user object for security.
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or the controller function
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found, throw an error
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
