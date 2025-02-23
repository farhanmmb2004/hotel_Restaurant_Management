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
      type: String, 
      required:true
    },
    pricing: {
      type: Number, 
      required: true,
    },
    image: {
      type: String, 
      required:true,
    },
  },
  { timestamps: true }
);
listingSchema.plugin(mongooseAggregatePaginate);
export const Listing = mongoose.model("Listing", listingSchema);
