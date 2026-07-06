import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accountName: {
      type: String,
      default: "",
    },
    accountDetails: {
      type: String,
      default: "",
    },
    qrCode: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PaymentMethod", paymentMethodSchema);