import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
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
const bookHotelOrRestaurent =asyncHandler(async(req,res)=>{
  const{placeId}=req.params;
  res.status(200).json(new ApiResponse(200,{placeId},"sucess"));
})

    export { registerUser, loginUser,logoutUser,bookHotelOrRestaurent };