const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [80, "Group name cannot exceed 80 characters"],
    },
    icon: {
      type: String,
      default: "🧾",
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    coords: {
      lat: { type: Number, default: null },
      lon: { type: Number, default: null },
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
      index: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    requireApproval: {
      type: Boolean,
      default: false,
    },
    splitModel: {
      type: String,
      enum: ["equal", "weighted", "itemized", "percentage"],
      default: "equal",
    },
    nettingEnabled: {
      type: Boolean,
      default: true,
    },
    subsidiesEnabled: {
      type: Boolean,
      default: true,
    },
    pennyPolicy: {
      type: String,
      enum: ["highest", "roundrobin", "organizer", "tipjar"],
      default: "highest",
    },
    budgetCap: {
      type: Number,
      default: null,
      min: 0,
    },
    privacy: {
      type: String,
      enum: ["public", "admin-only"],
      default: "public",
    },
    passcode: {
      type: String,
      default: null,
    },
    autoApproveMembers: {
      type: Boolean,
      default: false,
    },
    freezeLedger: {
      type: Boolean,
      default: false,
    },
    receiptMandatory: {
      type: Boolean,
      default: false,
    },
    receiptThreshold: {
      type: Number,
      default: 0,
    },
    approvalGate: {
      type: Boolean,
      default: false,
    },
    approvalThreshold: {
      type: Number,
      default: 0,
    },
    reminderCadence: {
      type: String,
      enum: ["manual", "daily", "3days", "end-only"],
      default: "3days",
    },
    deliveryChannels: {
      type: [String],
      enum: ["inapp", "email", "sms", "whatsapp"],
      default: ["inapp"],
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

groupSchema.index({ createdBy: 1, archivedAt: 1 });

module.exports = mongoose.model("Group", groupSchema);