const {onError} = require('./common');
const Notification = require('../models/notifications');
const { publishMessage } = require('./producer');
const {sendEmail}=require("../email-service/consumer");
const {sendSMS}=require("../sms-service/consumer");


exports.saveNotification = async (request, h) => {
  try{
  const { user, type, message, redirectUrl, targetId, targetType } = request.payload;

  const notification = await Notification.create({
    user,
    message,
    type: type|| "general",
    redirectUrl,
    targetId,
    targetType,
  });
  return h.response( { notification }).code(200);
}catch(error){
throw onError(error, 'Failed to save new Notification');
}
};

exports.sendSupportEmail = async (request, h) => {
  try{
  const { message, subject } = request.payload;

  const to = ["omri@dynatondata.com"];
  const msg = {
    to,
    from: "support@dynatondata.com",
    subject,
    text: message,
  };

 // await publishMessage('emailQueue', msg);

 sendEmail(msg)
   return h.response( { message: "Support Email send  successfully" }).code(200);
}catch(error){
 throw onError(error, 'Failed to send Support Email Notification');
}
};

exports.sendSMSNotification = async (request, h) => {
  try{
  const { message, phone } = request.payload;
  sendSMS(phone, message)
  return h.response({ message: "SMS send  successfully" }).code(200);
  }catch(error){
      throw onError(error, 'Failed to send SMS notification');
  }
};

exports.sendEmailNofication = async (request, h) => {
  try{
  const { message, subject,to } = request.payload;

  const msg = {
    to  : [to],
    from: "support@dynatondata.com",
    subject,
    text: message,
  };

 // await publishMessage('emailQueue', msg);

 sendEmail(msg)
   return h.response({ message: "Email send successfully" }).code(200);
}catch(error){
    throw onError(error, 'Failed to send Email notification');
}
};
exports.getAllNotifications = async (request, h) => {
  try{
  const notification = await Notification.find().sort({ createdAt: -1 });
  return h.response({ count: notification.length, notification }).code(200);
  }catch(error){
     throw onError(error, 'Failed to get notification');
  }
};

exports.getUserNotifications = async (request, h) => {
  try{
  const { userId, role } = request.params;
  const { page, limit } = request.query;

  let [{ data, pagination }] = await Notification.aggregate([
    {
      $match: {
        $or: [
          { type: "general" },
          { type: role },
          { user: userId },
        ],
        $and: [{ status: false }],
      },
    },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: page * limit },
          { $limit: limit },
          {
            $project: {
              message: 1, type: 1, status: 1,
              redirectUrl: 1, createdAt: 1, updatedAt: 1
            }
          }
        ],
        pagination: [{ $count: "total" }]
      }
    },
    {
      $project: {
        _id: 0,
        data: 1,
        pagination: { $ifNull: [{ $first: "$pagination" }, { total: 0 }] }
      }
    }
  ]);
   return h.response({ data: pagination }).code(200);
}catch(error){
   throw onError(error, 'Failed to get notification');
}
};

exports.dismissNotification = async (request,h) => {

    try {
        const { id, userId } = request.payload;

        const notification = await Notification.findOneAndUpdate({
            _id: id,
            user: userId
        }, {
            status: true
        }, {
            new: true
        });

        if (!notification) {
             return h.response({ message: 'Notification not found' }).code(201);
        }

        return h.response({data: notification}).code(200)

    } catch (error) {
      throw onError(error, 'Failed to dismiss notification');
    }

}
