import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing", 
      required: true,
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    bookingDates: {
      type: [Date],
      required: true,
    },
    bookingTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    paymentDetails: {
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },
      transactionId: { type: String, unique: true },
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
