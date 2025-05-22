const Joi = require('joi');
const { USER_ROLES_ENUM } = require('../constants');
const controller = require('./notificationController');


const base= "/notifications";

module.exports = [
  {
    method: 'POST',
    path: `${base}/add`,
    options: {
      tags: ['api'],
      description: 'Send a notification',
      validate: {
        payload: Joi.object({
          user: Joi.string().optional(),
          type: Joi.string().required(),
          to: Joi.string().required(),
          message: Joi.string().required(),
          redirectUrl: Joi.string().optional(),
          targetId: Joi.string().optional(),
          targetType: Joi.string().optional(),
        }),
      },
      handler: controller.sendNotification,
    }
  },
  {
    method: 'POST',
    path: `${base}/sendSupportEmail`,
    options: {
      tags: ['api'],
      description: 'Send support email',
      validate: {
        payload: Joi.object({
          subject: Joi.string().required(),
          message: Joi.string().required(),
        }),
      },
      handler: controller.sendSupportEmail,
    }
  },
  {
    method: 'POST',
    path: `${base}/sendEmailNotification`,
    options: {
      tags: ['api'],
      description: 'Send Notification email',
      validate: {
        payload: Joi.object({
          to: Joi.string().required(),
          subject: Joi.string().required(),
          message: Joi.string().required(),
        }),
      },
      handler: controller.sendSupportEmail,
    }
  },
  {
    method: 'GET',
    path: `${base}`,
    options: {
      tags: ['api'],
      description: 'Get all notifications',
      handler: controller.getAllNotifications,
    }
  },
  {
    method: 'GET',
    path: `${base}/all/{userId}/{role}`,
    options: {
      tags: ['api'],
      description: 'Get user-specific notifications',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(0).default(0),
          limit: Joi.number().integer().min(1).default(10),
        }),
        params: Joi.object({
          userId: Joi.string().required(),
          role: Joi.string().valid(...USER_ROLES_ENUM).required(),
        }),
      },
      handler: controller.getUserNotifications,
    }
  }
];
