import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    bookingReference: {
      type: String,
      unique: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Pending Verification",
        "Paid",
        "Rejected",
        "Refunded",
      ],
      default: "Pending",
    },

    bookingStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentProof: {
      type: String,
      default: "",
    },

    confirmationPdf: {
  type: String,
  default: "",
},

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);