const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/database');
const route53Routes = require('./routes/route53Routes');


// Middleware setup
app.use(express.json());// Parse JSON bodies
app.use(cors());//Enable Cross-Origin Resource Sharing

// Connect to MongoDB
connectDB();

// Define routes
app.use('/route53', route53Routes);// Mount Route53 routes under /route53 endpoint

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
