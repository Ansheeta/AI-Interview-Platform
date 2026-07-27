const express = require('express');
const interviewController = require('../controllers/interview.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  startInterviewSchema,
  submitInterviewSchema,
} = require('../validations/interview.validation');

const router = express.Router();

router.use(protect); // every interview route requires authentication

router.post('/', validate(startInterviewSchema), interviewController.startInterview);
router.get('/history', interviewController.getHistory);
router.get('/:id', interviewController.getInterview);
router.post(
  '/:id/submit',
  validate(submitInterviewSchema),
  interviewController.submitInterview
);
router.patch('/:id/abandon', interviewController.abandonInterview);

module.exports = router;
