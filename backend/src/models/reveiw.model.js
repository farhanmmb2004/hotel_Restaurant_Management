import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking", 
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, 
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } 
);

export const Review = mongoose.model("Review", reviewSchema);
