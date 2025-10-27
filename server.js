const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middlewares/errorhandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "https://orbitix.netlify.app"
}));

app.use(express.json());

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/attractions', require('./routes/attractionRoute'));
app.use('/api/events', require('./routes/eventRoute'));
app.use('/api/bookings', require('./routes/bookingRoute'));

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));