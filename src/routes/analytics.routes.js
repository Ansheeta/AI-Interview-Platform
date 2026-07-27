const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/overview', analyticsController.getDashboardOverview);
router.get('/score-trend', analyticsController.getScoreTrend);
router.get('/topic-wise', analyticsController.getTopicWiseAnalysis);

module.exports = router;
