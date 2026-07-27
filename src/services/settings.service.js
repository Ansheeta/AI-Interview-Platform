const User = require('../models/User.model');
const AppError = require('../utils/AppError');

async function updateSettings(userId, updates) {
  const setPayload = {};
  Object.entries(updates).forEach(([key, value]) => {
    setPayload[`settings.${key}`] = value;
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: setPayload },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
}

async function deleteAccount(userId, password) {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect password. Account was not deleted.', 401);
  }

  await user.deleteOne();
  // NOTE: for full data hygiene, also cascade-delete the user's Interviews
  // and Bookmarks here (or run a scheduled cleanup job) once those volumes
  // grow large enough that synchronous deletion would be slow.
}

module.exports = { updateSettings, deleteAccount };
