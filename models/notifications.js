const mongoose = require("mongoose");
const publisherSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      // can be general, for-advertiser, for-publisher, for-admin, for-agency , for-user
    },
    status: {
        type: Boolean,
        default: false,
        // true means read , false means unread
    },
    redirectUrl: {
      type: String,
    },
    
    targetId:{
      type: String,
      default: "",
    },
    targetType:{
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notifications", publisherSchema);
