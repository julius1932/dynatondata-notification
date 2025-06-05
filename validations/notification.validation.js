const Joi = require('joi');

// Payload for email
const emailNotificationPayload = Joi.object({
  to: Joi.string().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
}).label('EmailNotificationPayload');

// Payload for support
const supportNotificationPayload = Joi.object({
  subject: Joi.string().required(),
  message: Joi.string().required(),
}).label('SupportNotificationPayload');

// Payload for display
const displayNotificationPayload = Joi.object({
  user: Joi.string().optional(),
  status: Joi.boolean().optional().default(false),
  message: Joi.string().required(),
  targetId: Joi.string().optional(),
  targetType: Joi.string().optional(),
}).label('DisplayNotificationPayload');

// Payload for SMS
const smsNotificationPayload = Joi.object({
  phone: Joi.string().required(),
  message: Joi.string().required(),
}).label('smsNotificationPayload');




module.exports = {
  displayNotificationPayload,
  smsNotificationPayload,
  emailNotificationPayload,
  supportNotificationPayload
};
