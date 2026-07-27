const express = require('express');
const questionBankController = require('../controllers/questionBank.controller');
const { validateQuery } = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { listQuestionsQuerySchema } = require('../validations/questionBank.validation');

const router = express.Router();

router.use(protect);

router.get('/', validateQuery(listQuestionsQuerySchema), questionBankController.listQuestions);
router.get('/bookmarks', questionBankController.listBookmarked);
router.post('/:id/bookmark', questionBankController.toggleBookmark);

module.exports = router;
