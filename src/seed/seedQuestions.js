/* eslint-disable no-console */
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Question = require('../models/Question.model');
const questionBankData = require('./questionBankData');

async function seed() {
  await connectDB();

  const existingCount = await Question.countDocuments();
  if (existingCount > 0) {
    console.log(`[seed] Question collection already has ${existingCount} documents. Skipping.`);
    console.log('[seed] Pass --force to wipe and reseed: npm run seed -- --force');

    if (!process.argv.includes('--force')) {
      await mongoose.disconnect();
      process.exit(0);
    }
    await Question.deleteMany({});
    console.log('[seed] Cleared existing questions.');
  }

  await Question.insertMany(questionBankData);
  console.log(`[seed] Inserted ${questionBankData.length} questions.`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
