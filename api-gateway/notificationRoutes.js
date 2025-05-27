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
      description: 'Save Notification',
      validate: {
        payload: Joi.object({
          user: Joi.string().optional(),
          type: Joi.string().required(),
          status:Joi.boolean().optional().default(false),
          message: Joi.string().required(),
          redirectUrl: Joi.string().optional(),
          targetId: Joi.string().optional(),
          targetType: Joi.string().optional(),
        }),
      },
      handler: controller.saveNotification,
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
      handler: controller.sendEmailNofication,
    }
  },
  {
    method: 'POST',
    path: `${base}/sendSMSNotification`,
    options: {
      tags: ['api'],
      description: 'Send SMS Notification',
      validate: {
        payload: Joi.object({
          phone: Joi.string().required(),
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
  },{
    method: 'PATCH',
    path: `${base}/dismiss`,
    options: {
      tags: ['api'],
      description: 'Dismiss user-specific notification',
      validate: {
        payload: Joi.object({
          id: Joi.string().required(),
          userId: Joi.string().required(),
        })
      },
      handler: controller.getUserNotifications,
    }
  }

];

/* 
  "_id": "682efb9a44f32ff61706d00a",
      "user": "67b2f059d00db415acd68870",
      "message": "New SMS Campaign Created: Unicef Outreach by Hopkins",
      "type": "new_sms_campaign",
      "status": false,
      "targetId": "682efb9a44f32ff61706d008",
      "targetType": "advertiser_sms_campaign",
      "createdAt": "2025-05-22T10:25:30.682Z",
      "updatedAt": "2025-05-22T10:25:30.682Z",
      "__v": 0
    } */