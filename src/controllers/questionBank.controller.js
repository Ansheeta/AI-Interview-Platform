const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const questionBankService = require('../services/questionBank.service');

exports.listQuestions = catchAsync(async (req, res) => {
  const result = await questionBankService.listQuestions(req.user._id, req.query);

  return ApiResponse.send(res, {
    message: 'Questions fetched.',
    data: result,
  });
});

exports.toggleBookmark = catchAsync(async (req, res) => {
  const result = await questionBankService.toggleBookmark(req.user._id, req.params.id);

  return ApiResponse.send(res, {
    message: result.bookmarked ? 'Question bookmarked.' : 'Bookmark removed.',
    data: result,
  });
});

exports.listBookmarked = catchAsync(async (req, res) => {
  const questions = await questionBankService.listBookmarkedQuestions(req.user._id);

  return ApiResponse.send(res, {
    message: 'Bookmarked questions fetched.',
    data: { questions },
  });
});
