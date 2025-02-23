import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const listingSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    type: {
      type: String,
      enum: ["Hotel", "Restaurant"], 
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    facilities: {
      type: [String], 
      default: [],
    },
    pricing: {
      type: Number, 
      required: true,
    },
    images: {
      type: [String], 
      default: [],
    },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate);
export const Listing = mongoose.model("Listing", listingSchema);
