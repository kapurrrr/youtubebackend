import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {user} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { response } from "express";
 
const registerUser = asyncHandler(async (req, res) => {
    // get user details from froentend
    // validation
    // check if user already exists : username, email
    // check for images and avatar
    // upload images and avatar to cloudniary   
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response 

    const {fullname, email, username, password} = req.body
    console.log("email: ", email);

    if(
        [fullname, email, username, password].some((field)=> field?.trim === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await user.findOne({
        $or: [{email}, {username}]
    })    

    if(existedUser){
        throw new ApiError(409,"User with email or password already exists")
    }

    console.log("req.files: ", req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");

    const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImage");

    if(!avatar){
        throw new ApiError(500, "Error uploading avatar");
    }

    const User = await user.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage.url || ""
    })

    const createdUser = await user.findById(User._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Error creating user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )


});    

export {registerUser};
