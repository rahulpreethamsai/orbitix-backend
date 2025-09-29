const mongoose = require('mongoose');

// This function establishes the connection to the MongoDB database.
const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we use 'await'
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log the host it's connected to.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error during connection, log the error and exit the process.
    // It's critical to exit because the application cannot function without the database.
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
