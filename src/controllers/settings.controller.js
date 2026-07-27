const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const settingsService = require('../services/settings.service');
const { COOKIE_NAMES } = require('../config/constants');

exports.getSettings = catchAsync(async (req, res) => {
  return ApiResponse.send(res, {
    message: 'Settings fetched.',
    data: { settings: req.user.settings },
  });
});

exports.updateSettings = catchAsync(async (req, res) => {
  const user = await settingsService.updateSettings(req.user._id, req.body);

  return ApiResponse.send(res, {
    message: 'Settings updated successfully.',
    data: { settings: user.settings },
  });
});

exports.deleteAccount = catchAsync(async (req, res) => {
  await settingsService.deleteAccount(req.user._id, req.body.password);

  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);

  return ApiResponse.send(res, { message: 'Account deleted successfully.' });
});
