import { ApiError } from "../utils/ApiError.js";
import { asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyToken=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        throw new ApiError(401,"unAuthorized request");
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user){
    throw new ApiError(401,"INvalid Access Token");
    }
    req.user=user;
    next();
    } catch (error) {
        throw new ApiError(401,error?.messege||"Invalid access token");
    }
})
export const authorizeVendor = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "vendor") {
      throw new ApiError(403, "Access denied! Only vendors can perform this action.");
    }
    next();
  });