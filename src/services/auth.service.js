const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');

/**
 * Service layer holds business logic independent of req/res, so it can be
 * reused (e.g. by future admin tools, seed scripts, or tests) without
 * depending on Express.
 */

async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({ name, email, password });
  return user;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password.', 401);
  }

  user.lastLoginAt = new Date();
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
}

async function refreshUserSession(token) {
  if (!token) {
    throw new AppError('No refresh token provided. Please log in again.', 401);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Session is no longer valid. Please log in again.', 401);
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken: newRefreshToken };
}

async function logoutUser(userId) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
}

async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect.', 401);
  }

  user.password = newPassword;
  await user.save();
  return user;
}

async function updateUserProfile(userId, updates) {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  changeUserPassword,
  updateUserProfile,
};
