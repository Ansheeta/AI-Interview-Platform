const express = require('express');
const authRoutes = require('./auth.routes');
const interviewRoutes = require('./interview.routes');
const analyticsRoutes = require('./analytics.routes');
const questionBankRoutes = require('./questionBank.routes');
const settingsRoutes = require('./settings.routes');

const router = express.Router();

// Mount feature routers here as they're built so app.js only ever needs to
// know about `/api/v1`.
router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/questions', questionBankRoutes);
router.use('/settings', settingsRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

module.exports = router;
