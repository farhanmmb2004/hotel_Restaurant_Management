import {asyncHandler} from "../utils/asyncHandler.js";
import { Listing } from "../models/listing.model.js";
import { Booking } from "../models/booking.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Unit } from "../models/unit.model.js";
// ✅ ADD NEW HOTEL/RESTAURANT LISTING
export const addListing = asyncHandler(async (req, res) => {
  const { name, address, description, facilities, pricing,type } = req.body;
  if (!name||!address||!description||!facilities||!pricing||!type) {
    throw new ApiError(400, "Enter All the datails");
  }
  if (!req.file) {
    throw new ApiError(400, "Listing image is required");
  }

  const imageLocalPath = req.file.path;
  const uploadedImage = await uploadOnCloudinary(imageLocalPath);

  if (!uploadedImage) {
    throw new ApiError(500, "Failed to upload image");
  }
  console.log(uploadedImage.url);
  const newListing = await Listing.create({
    vendorId: req.user._id,
    name,
    address,
    description,
    facilities,
    pricing,
    type,
    image: uploadedImage?.url||"",
  });

  res.status(201).json(new ApiResponse(201,newListing,"added"));
});

// ✅ UPDATE LISTING (Only Vendor who created it can update)
export const updateListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const { name, address, description, facilities, pricing,type } = req.body;

  let updatedData = { name, address, description, facilities, pricing,type };

  if (req.file) {
    const imageLocalPath = req.file.path;
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      throw new ApiError(500, "Failed to upload image");
    }
    updatedData.image = uploadedImage?.url||"";
  }
  let cur=await Listing.findById(listingId);
  if(cur.vendorId.toString()!==req.user?._id.toString()){
  throw new ApiError(400,"listing not found or only vendor of this can update");
  }
  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    updatedData,
    { new: true }
  );

  if (!updatedListing) {
    throw new ApiError(404, "Listing not found");
  }

  res.status(200).json(new ApiResponse(200,updatedListing,"updated"));
});

// ✅ DELETE LISTING
export const deleteListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const vendorId = req.user._id;

  const deletedListing = await Listing.findOneAndDelete({ _id: listingId, vendorId });

  if (!deletedListing) throw new ApiError(404, "Listing not found or unauthorized");

  res.status(200).json(new ApiResponse(200, {}, "Listing deleted successfully"));
});

// ✅ VIEW BOOKINGS FOR VENDOR'S LISTINGS
export const getVendorBookings = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  const bookings = await Booking.find({}).populate("customerId", "name email");

  const vendorBookings = bookings.filter((booking) => booking.listingId.vendorId.toString() === vendorId.toString());

  res.status(200).json(new ApiResponse(200, vendorBookings, "Bookings retrieved successfully"));
});

// ✅ UPDATE BOOKING STATUS (CONFIRM/CANCEL)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body; 
  const vendorId = req.user._id;

  const booking = await Booking.findById(bookingId).populate("listingId");

  if (!booking || booking.listingId.vendorId.toString() !== vendorId.toString()) {
    throw new ApiError(403, "Unauthorized or booking not found");
  }

  booking.status = status;
  await booking.save();

  res.status(200).json(new ApiResponse(200, booking, `Booking status updated to ${status}`));
});
//add unit
export const addUnit = asyncHandler(async (req, res) => {
  const { listingId}=req.params
  const { name, capacity, price } = req.body;
  if(!name||!capacity||!price){
  throw new ApiError(400,"name capacity and price are required");
  }
  // Check if listing exists and belongs to the vendor
  const listing = await Listing.findById(listingId);
  if (!listing) {
      throw new ApiError(404, "Listing not found");
  }
  if (listing.vendorId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to add units to this listing");
  }
  const type=listing.type==="Restaurent"?"Table":"Room"
  const newUnit = await Unit.create({ listingId,type, name, capacity, price });

  res.status(201).json(new ApiResponse(201,newUnit,"added"));
});

// 🔵 Update a Unit (Modify pricing, availability, etc.)
export const updateUnit = asyncHandler(async (req, res) => {
  const { unitId } = req.params;
  const { name, capacity, price, availability } = req.body;

  const unit = await Unit.findById(unitId);
  if (!unit) {
      throw new ApiError(404, "Unit not found");
  }
  
  // Check if the unit belongs to the vendor
  const listing = await Listing.findById(unit.listingId);
  if (listing.vendorId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to update this unit");
  }

  unit.name = name || unit.name;
  unit.capacity = capacity || unit.capacity;
  unit.price = price || unit.price;
  unit.availability = availability || unit.availability;

  await unit.save();

  res.status(200).json({ success: true, unit });
});

// 🔴 Delete a Unit
export const deleteUnit = asyncHandler(async (req, res) => {
  const { unitId } = req.params;

  const unit = await Unit.findById(unitId);
  if (!unit) {
      throw new ApiError(404, "Unit not found");
  }

  // Check if the unit belongs to the vendor
  const listing = await Listing.findById(unit.listingId);
  if (listing.vendorId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not authorized to delete this unit");
  }

  await unit.deleteOne();

  res.status(200).json({ success: true, message: "Unit deleted successfully" });
});


// ✅ ANALYTICS: TOTAL BOOKINGS & REVENUE PER LISTING
export const getVendorAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  const listings = await Listing.find({ vendorId });

  const analytics = await Promise.all(
    listings.map(async (listing) => {
      const bookings = await Booking.find({ listingId: listing._id, status: "Completed" });
      const revenue = bookings.reduce((total, booking) => total + booking.paymentDetails.amount, 0);

      return {
        listingId: listing._id,
        name: listing.name,
        totalBookings: bookings.length,
        totalRevenue: revenue,
      };
    })
  );

  res.status(200).json(new ApiResponse(200, analytics, "Analytics retrieved successfully"));
});
