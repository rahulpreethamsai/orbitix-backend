// Import necessary packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const errorHandler= require('./middlewares/errorhandler');

// Import route files
const userRoutes = require('./routes/userRoute');
const eventRoutes = require('./routes/eventRoute');
const bookingRoutes = require('./routes/bookingRoute');

// Load environment variables from .env file
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Initialize the Express app
const app = express();

// Middleware to enable Cross-Origin Resource Sharing (CORS)
// This allows your React frontend (on a different port) to communicate with this backend
app.use(cors());

// Middleware to parse incoming JSON requests
// This allows us to access request body data via `req.body`
app.use(express.json());

// Define the main API routes
// Any request to '/api/users' will be handled by the userRoutes file
app.use('/api/users', userRoutes);
// Any request to '/api/events' will be handled by the eventRoutes file
app.use('/api/events', eventRoutes);
// Any request to '/api/bookings' will be handled by the bookingRoutes file
app.use('/api/bookings', bookingRoutes);

// --- Error Handling Middleware ---
// These must be placed after your API routes
// Handles requests to routes that don't exist

const notFound = (req, res, next) => {
  res.status(404);
  throw new Error(`Not Found - ${req.originalUrl}`);
};

app.use(notFound);
// A custom error handler that catches errors thrown in controllers
app.use(errorHandler);

// Define the port for the server to run on
// It will use the port from the .env file, or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
