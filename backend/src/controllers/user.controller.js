import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { Listing } from "../models/listing.model.js";
import { Booking } from "../models/booking.model.js";
import { Unit } from "../models/unit.model.js";
import { Review } from "../models/reveiw.model.js";
import mongoose from "mongoose";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken;
        user.save({validateBeforeSave:false});
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"internal issue");
    }
    }
const registerUser = asyncHandler(async (req, res) => {
        const { name, email, password, phone, role } = req.body;
        console.log(name);
        if (!name || !email || !password || !phone) {
            throw new ApiError(400, "All fields are required");
        }
    
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ApiError(400, "User already exists with this email");
        }
    
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role,
        });
    
        if (user) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
            res.status(201).json(new ApiResponse(201, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                accessToken
            }, "User registered successfully"));
        } else {
            throw new ApiError(500, "User registration failed");
        }
    });
const loginUser = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
    
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }
    
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const options={
            httpOnly:true,
            secure:true
        }
        res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            accessToken
        }, "Login successful"));
    });
const logoutUser=asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
           req.user._id,
           {
               $unset:{
                   refreshToken:1
               }
           }
        )
        const options={
           httpOnly:true,
           secure:true
       }
       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse(200,{},"User logged Out"))
   });
const browseListings = asyncHandler(async (req, res) => {
    const { location, minPrice, maxPrice, rating, amenities, type } = req.query;
  
    let filter = {};
  
    if (location) filter["address.city"] = location;
    if (minPrice) filter.pricing = { $gte: minPrice };
    if (maxPrice) filter.pricing = { ...filter.pricing, $lte: maxPrice };
    if (rating) filter.rating = { $gte: rating };
    if (amenities) filter.facilities = { $all: amenities.split(",") };
    if (type) filter.type = type;
  
    const listings = await Listing.find(filter);
  
    res.status(200).json(new ApiResponse(200, listings, "Listings retrieved successfully"));
  });
const viewListingDetails = asyncHandler(async (req, res) => {
    const{listingId}=req.params
    const listing = await Listing.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(listingId)
            }
        },{
           $lookup:{
            from:"users",
            foreignField:"_id",
            localField:"vendorId",
            as:"vendorDetails"
           } 
            },{
                $unwind:"$vendorDetails"
            },
            {
                $lookup:{
                    from:"units",
                    foreignField:"listingId",
                    localField:"_id",
                    as:"unitDetails"
                }
            },
            {
                $project:{
                    _id:1,
                    type:1,
                    name:1,
                    description:1,
                    adress:1,
                    facilities:1,
                    pricing:1,
                    image:1,
                    vendorId:1,
                    vendorDetails:{
                        name:1,
                        phone:1,
                        email:1,
                        vendorId:1,
                        createdAt:1
                    },
                    unitDetails:{
                        _id:1,
                        type:1,
                        name:1,
                        capacity:1,
                        price:1,
                        availability:1,
                    }
                }
            }
    ]);
  
    if (!listing) {
      throw new ApiError(404, "Listing not found");
    }
  
    res.status(200).json(new ApiResponse(200, listing[0], "Listing details retrieved successfully"));
  });

const bookListingUnit = asyncHandler(async (req, res) => {
    const {listingId, unitId}=req.params
    const {  bookingDate, bookingTime,vendorId } = req.body;
    const bookingDates=new Date(bookingDate);
    if (!listingId || !unitId || !bookingDates||!bookingTime) {
        throw new ApiError(400, "Missing booking details");
    }
    const unit = await Unit.findById(unitId);
    if (!unit) {
        throw new ApiError(404, "Unit not found");
    }
    console.log(unit);
    if (unit.listingId.toString()!=listingId) {
        throw new ApiError(404, "invalid listning id");
    }
    const existingBookings = await Booking.find({
        listingId,
        unitId,
        bookingDates, 
        bookingTime,
        status:"Confirmed" 
    });

    if (existingBookings.length >= unit.capacity) {
        throw new ApiError(400, "No availability for the selected dates");
    }

    const newBooking = await Booking.create({
        customerId: req.user._id,
        listingId,
        unitId,
        bookingDates,
        bookingTime,
        status: "Pending",
        vendorId,
    });

    res.status(201).json(new ApiResponse(201, newBooking, "Booking successful, pending approval"));
});

const bookingHistory = asyncHandler(async (req, res) => {
    // Using aggregation pipeline to join bookings with reviews
    const bookings = await Booking.aggregate([
      // Match bookings for the current user
      {
        $match: { 
          customerId: new mongoose.Types.ObjectId(req.user._id) 
        }
      },
      // Lookup listings data
      {
        $lookup: {
          from: "listings",
          localField: "listingId",
          foreignField: "_id",
          as: "listingData"
        }
      },
      // Lookup unit data
      {
        $lookup: {
          from: "units",
          localField: "unitId",
          foreignField: "_id",
          as: "unitData"
        }
      },
      // Unwind the arrays (since lookups return arrays)
      {
        $unwind: {
          path: "$listingData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$unitData",
          preserveNullAndEmptyArrays: true
        }
      },
      // Left join with reviews to check if the user has reviewed this booking
      {
        $lookup: {
          from: "reviews",
          let: { bookingId: "$_id", customerId: "$customerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$bookingId", { $toObjectId: "$$bookingId" }] }, // Convert if necessary
                    { $eq: ["$customerId", "$$customerId"] }
                  ]
                }
              }
            }
          ],
          as: "reviewData"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendorData"
        }
      },
      // Lookup current user's data to check favorites
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "currentUserData"
        }
      },
      {
        $unwind: {
          path: "$currentUserData",
          preserveNullAndEmptyArrays: true
        }
      },
      // Add the hasReviewed field based on whether the review exists
      {
        $addFields: {
          hasReviewed: { $gt: [{ $size: "$reviewData" }, 0] },
          isFavorite: {
            $cond: {
              if: { $in: ["$unitId", { $ifNull: ["$currentUserData.favorites", []] }] },
              then: true,
              else: false
            }
          }
        }
      },
      // Remove the reviewData and currentUserData arrays from the final results
      {
        $project: {
          reviewData: 0,
          currentUserData: 0
        }
      },
      // Sort by creation date in descending order (most recent first)
      {
        $sort: { createdAt: -1 }
      }
    ]);
    
  
    res.status(200).json(new ApiResponse(200, bookings, "Booking history retrieved successfully"));
  });
const writeReview = asyncHandler(async (req, res) => {
    const {bookingId}=req.params
    const { rating, comment } = req.body;
  
    if (!bookingId || !rating) {
      throw new ApiError(400, "Rating and bookingId are required");
    }
  
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.customerId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized to review this booking");
    }
    if(booking.status!=='Completed'){
     throw new ApiError(403,"cannot rate the booking before taking the services")
    }
    const isReveiwExist=await Review.findOne({bookingId});
    if(isReveiwExist){
     throw new ApiError(401,"reveiw already exists");
    }
    const newReview = await Review.create({
      bookingId,
      customerId: req.user._id,
      rating,
      comment,
    });
  
    res.status(201).json(new ApiResponse(201, newReview, "Review submitted successfully"));
  });
const TogglefavoriteUnits=asyncHandler(async(req,res)=>{
    const{unitId}=req.params;
    if(!unitId){
       throw new ApiError(400,"unitId is required");
    }
    const unit=await Unit.findById(unitId);
    if(!unit){
         throw new ApiError(404,"unit not found");
    }
    const user=await User.findById(req.user._id);
    if(user.favorites.includes(unitId)){
        user.favorites.pull(unitId);
        await user.save({validateBeforeSave:false});
        return res.status(200).json(new ApiResponse(200,{},"unit removed from favorites"));
    }
    user.favorites.push(unitId);
    await user.save()
    return res.status(200).json(new ApiResponse(200,{},"unit added to favorites"))
})
const favoritesBooking=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const user=await User.findById(userId);

    const favoriteUnits=await Unit.aggregate([
      {$match:{
        _id:{$in:user.favorites}
      }},
      {
       $lookup:{
        from:"listings",
        foreignField:"_id",
        localField:"listingId",
        as:"listingDetails"
       }
      },
    //   {
    //     $project:{
    //       _id:1,
    //       type:1,

    //   }
    // }
    ])
    return res.status(200).json(new ApiResponse(200,favoriteUnits,"favorite units fetched successfully"))
  });
const customerDashboard=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const data=await User.aggregate([
        { $match: {_id:new mongoose.Types.ObjectId(userId)}},
        {
          $lookup:{
            from:"bookings",
            foreignField:"customerId",
            localField:"_id",
            as:"bookings"
          }
        },
        {
          $addFields:{
            totalBookings:{$size:"$bookings"},
            activeBookings:{$size:{
              $filter:{
                input:"$bookings",  
                as:"booking",
                cond:{ $in:["$$booking.status",["Pending","Confirmed"]]}  
          }
        }}
      }
        },
        {
          $unwind:"$bookings"
        },
      {
          $lookup:{
            from:"reviews",
            foreignField:"customerId",
            localField:"_id",
            as:"reviews"
          }
        
        },{
          $addFields:{
            totalReviews:{$size:"$reviews"}
          }
        },
        {
        $project:{
          name:1,
          email:1,
          totalBookings:1,
          activeBookings:1,
          totalReviews:1,
          favorites:{$size:"$favorites"}
        }
      }
    ])
    return res.status(200).json(new ApiResponse(200,data[0],"customer dashboard data"))
});

    export { registerUser,
         loginUser,logoutUser,
         browseListings,
         writeReview,
         bookingHistory,
         bookListingUnit,
         viewListingDetails,
          TogglefavoriteUnits,
          customerDashboard,
          favoritesBooking
         };