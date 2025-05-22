const Notification = require('../models/notifications');
const { publishMessage } = require('./producer');
const {sendEmail}=require("../email-service/consumer")
exports.sendNotification = async (request, h) => {
  const { user, type, to, message, redirectUrl, targetId, targetType } = request.payload;

  const notifDoc = await Notification.create({
    user,
    message,
    type: "general",
    redirectUrl,
    targetId,
    targetType,
  });

  await publishMessage(
    type === 'email' ? 'emailQueue' : 'smsQueue',
    { to, message, notificationId: notifDoc._id }
  );

  return notifDoc;
};

exports.sendSupportEmail = async (request, h) => {
  const { message, subject } = request.payload;

  const to = ["omri@dynatondata.com","las@dynatondata.com"];
  const msg = {
    to,
    from: "support@dynatondata.com",
    subject,
    text: message,
  };

 // await publishMessage('emailQueue', msg);

 sendEmail(msg)
  return { message: "Email send successfully" };
};


exports.sendEmailNofication = async (request, h) => {
  const { message, subject,to } = request.payload;

  const msg = {
    to,
    from: "support@dynatondata.com",
    subject,
    text: message,
  };

 // await publishMessage('emailQueue', msg);

 sendEmail(msg)
  return { message: "Email send successfully" };
};
exports.getAllNotifications = async (request, h) => {
  const notification = await Notification.find().sort({ createdAt: -1 });
  return { count: notification.length, notification };
};

exports.getUserNotifications = async (request, h) => {
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

  return { data, pagination };
};
