const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.mongoUri);

    // eslint-disable-next-line no-console
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`[db] MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      // eslint-disable-next-line no-console
      console.warn('[db] MongoDB disconnected');
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[db] Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
