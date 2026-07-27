const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analytics.service');

exports.getDashboardOverview = catchAsync(async (req, res) => {
  const overview = await analyticsService.getDashboardOverview(req.user._id);

  return ApiResponse.send(res, {
    message: 'Dashboard overview fetched.',
    data: overview,
  });
});

exports.getScoreTrend = catchAsync(async (req, res) => {
  const { granularity = 'weekly' } = req.query;
  const trend = await analyticsService.getScoreTrend(req.user._id, granularity);

  return ApiResponse.send(res, {
    message: 'Score trend fetched.',
    data: { trend, granularity },
  });
});

exports.getTopicWiseAnalysis = catchAsync(async (req, res) => {
  const breakdown = await analyticsService.getTopicWiseAnalysis(req.user._id);

  return ApiResponse.send(res, {
    message: 'Topic-wise analysis fetched.',
    data: { breakdown },
  });
});
