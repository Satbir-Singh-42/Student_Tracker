import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use environment variable or default to local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-activity-platform';
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to in-memory storage for development');
    // Don't exit - let the app continue with in-memory storage
  }
};

export default connectDB;