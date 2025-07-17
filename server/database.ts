import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use environment variable or default to local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-activity-platform';
    
    await mongoose.connect(mongoUri);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;