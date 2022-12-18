const mongoose = require("mongoose");

const InquirySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    to: {
      type: String,
      enum: ["showroom", "web"],
      default: "web",
    },
    region: {
      type: String,
      enum: [
        "santa ana",
        "san bernardino",
        "san diego",
        "los angeles",
        "outer areas",
      ],
      default: "santa ana",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
