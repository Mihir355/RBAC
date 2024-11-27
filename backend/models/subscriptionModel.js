const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    createdBy: {
      type: String,
      required: true,
    },
    currentRole: {
      type: String,
      enum: ["guest", "viewer", "editor"],
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ["manager", "editor", "viewer"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "approved"],
      default: "requested", // Default to 'requested' when a new subscription is created
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
