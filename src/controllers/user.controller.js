import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError, APiError} from "../utils/apiError.js";
import {user} from "../models/user.model.js";
import {cloudniary} from "../utils/cloudniary.js";
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

    const existedUser =  user.findOne({
        $or: [{email}, {username}]
    })    

    if(existedUser){
        throw new ApiError(409,"User with email or password already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudniary(avatarLocalPath, "avatar");

    const coverImage = await uploadOnCloudniary(coverImageLocalPath, "coverImage");

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
