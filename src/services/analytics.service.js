const mongoose = require('mongoose');
const Interview = require('../models/Interview.model');
const { INTERVIEW_STATUS } = require('../config/constants');

/**
 * High-level dashboard summary: totals, average score, recent interviews.
 */
async function getDashboardOverview(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const completedMatch = {
    user: userObjectId,
    status: INTERVIEW_STATUS.COMPLETED,
  };

  const [stats] = await Interview.aggregate([
    { $match: completedMatch },
    {
      $group: {
        _id: null,
        totalCompleted: { $sum: 1 },
        averageScore: { $avg: '$overallScore' },
        bestScore: { $max: '$overallScore' },
      },
    },
  ]);

  const totalInterviews = await Interview.countDocuments({ user: userObjectId });
  const recentInterviews = await Interview.find({ user: userObjectId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('company role difficulty status overallScore createdAt');

  return {
    totalInterviews,
    totalCompleted: stats?.totalCompleted || 0,
    averageScore: stats?.averageScore ? Math.round(stats.averageScore) : 0,
    bestScore: stats?.bestScore || 0,
    recentInterviews,
  };
}

/**
 * Score trend bucketed by week or month for the analytics charts.
 */
async function getScoreTrend(userId, granularity = 'weekly') {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const dateFormat = granularity === 'monthly' ? '%Y-%m' : '%Y-%U'; // %U = week number

  const trend = await Interview.aggregate([
    { $match: { user: userObjectId, status: INTERVIEW_STATUS.COMPLETED } },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$completedAt' } },
        averageScore: { $avg: '$overallScore' },
        interviewsCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return trend.map((t) => ({
    period: t._id,
    averageScore: Math.round(t.averageScore),
    interviewsCount: t.interviewsCount,
  }));
}

/**
 * Topic-wise (category) performance breakdown, averaged across all
 * answered questions in completed interviews. Category lives on the
 * question sub-document, not the answer, so we resolve it in application
 * code after loading each interview's questions + answers together.
 */
async function getTopicWiseAnalysis(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const interviews = await Interview.find({
    user: userObjectId,
    status: INTERVIEW_STATUS.COMPLETED,
  }).select('questions answers');

  const categoryTotals = {};
  interviews.forEach((interview) => {
    interview.answers.forEach((answer) => {
      const question = interview.questions[answer.questionIndex];
      if (!question || typeof answer.score !== 'number') return;

      const category = question.category || 'General';
      if (!categoryTotals[category]) {
        categoryTotals[category] = { totalScore: 0, count: 0 };
      }
      categoryTotals[category].totalScore += answer.score;
      categoryTotals[category].count += 1;
    });
  });

  return Object.entries(categoryTotals).map(([category, { totalScore, count }]) => ({
    category,
    averageScore: Math.round(totalScore / count),
    questionsAnswered: count,
  }));
}

module.exports = { getDashboardOverview, getScoreTrend, getTopicWiseAnalysis };
