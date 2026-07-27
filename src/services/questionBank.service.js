const Question = require('../models/Question.model');
const Bookmark = require('../models/Bookmark.model');

async function listQuestions(userId, { category, difficulty, search, page, limit }) {
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;

  const [items, total, bookmarks] = await Promise.all([
    Question.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Question.countDocuments(query),
    Bookmark.find({ user: userId }).select('question'),
  ]);

  const bookmarkedIds = new Set(bookmarks.map((b) => b.question.toString()));
  const itemsWithBookmarkFlag = items.map((item) => ({
    ...item.toObject(),
    isBookmarked: bookmarkedIds.has(item._id.toString()),
  }));

  return {
    items: itemsWithBookmarkFlag,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function toggleBookmark(userId, questionId) {
  const existing = await Bookmark.findOne({ user: userId, question: questionId });

  if (existing) {
    await existing.deleteOne();
    return { bookmarked: false };
  }

  await Bookmark.create({ user: userId, question: questionId });
  return { bookmarked: true };
}

async function listBookmarkedQuestions(userId) {
  const bookmarks = await Bookmark.find({ user: userId })
    .populate('question')
    .sort({ createdAt: -1 });

  return bookmarks.map((b) => b.question).filter(Boolean);
}

module.exports = { listQuestions, toggleBookmark, listBookmarkedQuestions };
