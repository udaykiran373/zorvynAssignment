const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/finance_db';
        await mongoose.connect(uri);
        console.log(`MongoDB connected: ${uri}`);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
