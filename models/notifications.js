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
    status: {
        type: Boolean,
        default: false,
        // true means read , false means unread
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
