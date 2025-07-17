import mongoose from 'mongoose';

let isMongoDBConnected = false;

const connectDB = async (): Promise<boolean> => {
  try {
    // Use environment variable or default to local MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-activity-platform';
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000, // Timeout after 8s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      heartbeatFrequencyMS: 10000, // Check server connection every 10 seconds
    });
    
    isMongoDBConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isMongoDBConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      isMongoDBConnected = true;
    });
    
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      isMongoDBConnected = false;
    });
    
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    console.log('🔄 Falling back to in-memory storage for development');
    isMongoDBConnected = false;
    return false;
  }
};

export const getMongoDBStatus = (): boolean => isMongoDBConnected;

export const checkMongoDBConnection = async (): Promise<boolean> => {
  if (!isMongoDBConnected) {
    return false;
  }
  
  try {
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB ping failed:', error);
    isMongoDBConnected = false;
    return false;
  }
};

export default connectDB;