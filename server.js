const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const cors = require('cors'); // 1. IMPORT THE CORS PACKAGE
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middlewares/errorhandler');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 2. ADD THIS SECTION TO CONFIGURE CORS FOR YOUR API
app.use(cors({
  origin: "https://orbitix.netlify.app" // Allow your frontend to make requests
}));

// This config is for Socket.IO and is also correct
const io = new Server(server, {
  cors: {
    origin: "https://orbitix.netlify.app", // It's good practice to also specify the origin here
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
    socket.to(data.eventId).emit('updateSeatStatus', {
      seatNumber: data.seatNumber,
      status: 'selected'
    });
  });

  socket.on('seatDeselected', (data) => {
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));