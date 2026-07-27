const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const interviewService = require('../services/interview.service');

exports.startInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.startInterview(req.user._id, req.body);

  return ApiResponse.send(res, {
    statusCode: 201,
    message: 'Interview started. Good luck!',
    data: { interview },
  });
});

exports.getInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.getInterviewById(req.user._id, req.params.id);

  return ApiResponse.send(res, {
    message: 'Interview fetched.',
    data: { interview },
  });
});

exports.submitInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.submitInterview(
    req.user._id,
    req.params.id,
    req.body
  );

  return ApiResponse.send(res, {
    message: 'Interview evaluated successfully.',
    data: { interview },
  });
});

exports.abandonInterview = catchAsync(async (req, res) => {
  const interview = await interviewService.abandonInterview(req.user._id, req.params.id);

  return ApiResponse.send(res, {
    message: 'Interview marked as abandoned.',
    data: { interview },
  });
});

exports.getHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = '', status } = req.query;

  const result = await interviewService.getInterviewHistory(req.user._id, {
    page: Number(page),
    limit: Number(limit),
    search,
    status,
  });

  return ApiResponse.send(res, {
    message: 'Interview history fetched.',
    data: result,
  });
});
