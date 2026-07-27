const express = require('express');
const settingsController = require('../controllers/settings.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  updateSettingsSchema,
  deleteAccountSchema,
} = require('../validations/settings.validation');

const router = express.Router();

router.use(protect);

router.get('/', settingsController.getSettings);
router.patch('/', validate(updateSettingsSchema), settingsController.updateSettings);
router.delete('/account', validate(deleteAccountSchema), settingsController.deleteAccount);

module.exports = router;
