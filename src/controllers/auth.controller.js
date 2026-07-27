const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const authService = require('../services/auth.service');
const { COOKIE_NAMES } = require('../config/constants');
const {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} = require('../utils/cookieOptions');

exports.register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);

  return ApiResponse.send(res, {
    statusCode: 201,
    message: 'Account created successfully. Please log in.',
    data: { user: user.toSafeObject() },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { rememberMe = true } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, getAccessTokenCookieOptions());
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshTokenCookieOptions(rememberMe));

  return ApiResponse.send(res, {
    message: 'Logged in successfully.',
    data: { user: user.toSafeObject(), accessToken },
  });
});

exports.refresh = catchAsync(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
  const { user, accessToken, refreshToken } = await authService.refreshUserSession(token);

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, getAccessTokenCookieOptions());
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshTokenCookieOptions());

  return ApiResponse.send(res, {
    message: 'Session refreshed.',
    data: { user: user.toSafeObject(), accessToken },
  });
});

exports.logout = catchAsync(async (req, res) => {
  if (req.user) {
    await authService.logoutUser(req.user._id);
  }

  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);

  return ApiResponse.send(res, { message: 'Logged out successfully.' });
});

exports.getCurrentUser = catchAsync(async (req, res) => {
  return ApiResponse.send(res, {
    message: 'Current user fetched.',
    data: { user: req.user.toSafeObject() },
  });
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changeUserPassword(req.user._id, currentPassword, newPassword);

  return ApiResponse.send(res, { message: 'Password changed successfully.' });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);

  return ApiResponse.send(res, {
    message: 'Profile updated successfully.',
    data: { user: user.toSafeObject() },
  });
});

exports.uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file was uploaded.', 400));
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const user = await authService.updateUserProfile(req.user._id, { avatar: avatarUrl });

  return ApiResponse.send(res, {
    message: 'Avatar uploaded successfully.',
    data: { user: user.toSafeObject() },
  });
});
