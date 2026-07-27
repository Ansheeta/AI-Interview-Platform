const Joi = require('joi');

const updateSettingsSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark', 'system').optional(),
  emailNotifications: Joi.boolean().optional(),
  pushNotifications: Joi.boolean().optional(),
  profileVisibility: Joi.string().valid('public', 'private').optional(),
}).min(1);

const deleteAccountSchema = Joi.object({
  password: Joi.string().required(),
  confirm: Joi.string().valid('DELETE').required().messages({
    'any.only': 'Please type DELETE to confirm account deletion.',
  }),
});

module.exports = { updateSettingsSchema, deleteAccountSchema };
