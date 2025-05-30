const Joi = require('joi');
const { USER_ROLES_ENUM } = require('../constants');
const controller = require('./notificationController');
const {
  displayNotificationPayload,
  smsNotificationPayload,
  emailNotificationPayload,
  supportNotificationPayload
} = require('../validations/notification.validation');


const base= "/notifications";

module.exports = [
     {
    method: 'POST',
    path: `${base}/send/support`,
    options: {
      tags: ['api'],
      description: 'Send Email Notification for Support',
      validate: {
        payload: supportNotificationPayload,
      },
      handler: controller.sendSupportEmailNotification,
    }
  }, 
   {
    method: 'POST',
    path: `${base}/send/displayads`,
    options: {
      tags: ['api'],
      description: 'Send Display Ads Notification',
      validate: {
        payload: displayNotificationPayload,
      },
      handler: controller.sendToDisplay,
    }
  }, 

  {
    method: 'POST',
    path: `${base}/send/sms`,
    options: {
      tags: ['api'],
      description: 'Send SMS Notification',
      validate: {
        payload: smsNotificationPayload,
      },
      handler: controller.sendSmsNotification,
    }
  }, 

   {
    method: 'POST',
    path: `${base}/send/email`,
    options: {
      tags: ['api'],
      description: 'Send Email Notification',
      validate: {
        payload: emailNotificationPayload,
      },
      handler: controller.sendEmailNotification,
    }
  }, 

  
  {
    method: 'GET',
    path: `${base}/{userId}`,
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
        }).label('DismissNotificationPayload')
      },
      handler: controller.dismissNotification,
    }
  }

];
