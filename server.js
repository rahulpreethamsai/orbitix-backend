const express = require('express');
const http = require('http'); // Import Node's built-in http module
const { Server } = require("socket.io"); // Import the Server class from socket.io
const dotenv = require('dotenv');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middlewares/errorhandler');

dotenv.config();
connectDB();

const app = express();
// This creates an HTTP server from your Express app
const server = http.createServer(app); 

// Attach Socket.IO to the server and configure CORS
const io = new Server(server, {
  cors: {
    origin: "*", // For development, you can use "*". For production, restrict this to your frontend's URL.
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// Your existing API routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/attractions', require('./routes/attractionRoute'));
app.use('/api/events', require('./routes/eventRoute'));
app.use('/api/bookings', require('./routes/bookingRoute'));

app.use(errorHandler);

// --- WebSocket Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinEventRoom', (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined room ${eventId}`);
  });

  socket.on('seatSelected', (data) => {
    // Broadcast to everyone else in the room that a seat has been temporarily selected
    socket.to(data.eventId).emit('updateSeatStatus', {
      seatNumber: data.seatNumber,
      status: 'selected'
    });
  });

  socket.on('seatDeselected', (data) => {
    // Broadcast that the seat is now available again
    socket.to(data.eventId).emit('updateSeatStatus', {
        seatNumber: data.seatNumber,
        status: 'available'
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
// IMPORTANT: Use the 'server' object to listen, not 'app'
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));