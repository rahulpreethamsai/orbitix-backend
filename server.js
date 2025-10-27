const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/dbConnection')
const errorHandler = require('./src/middlewares/errorhandler');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "https://orbitix.netlify.app"
}));

app.use(express.json());

app.use('/api/users', require('./src/routes/userRoute'));
app.use('/api/attractions', require('./src/routes/attractionRoute'));
app.use('/api/events', require('./src/routes/eventRoute'));
app.use('/api/bookings', require('./src/routes/bookingRoute'));

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));