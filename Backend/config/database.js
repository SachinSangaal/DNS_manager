const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/DNSdb';
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected...');
    }
  catch (error) 
    {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
    }
};

module.exports = connectDB;

