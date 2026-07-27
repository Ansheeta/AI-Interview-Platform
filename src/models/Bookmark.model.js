const mongoose = require('mongoose');

// A join model (rather than an array on User or Question) so bookmark
// counts/lookups scale independently of how large either parent doc gets.
const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  },
  { timestamps: true }
);

// A user can only bookmark a given question once.
bookmarkSchema.index({ user: 1, question: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
