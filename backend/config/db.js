import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/royaldaawat');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries--;
      console.error(`Database connection failed: ${error.message}. Retries remaining: ${retries}`);
      if (retries === 0) {
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
