import { type } from "express/lib/response";
import mongoose, {Schema} from "mongoose";
import jwt from jsonwebtoken
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true // helps in searching in database
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            trim: true,
            index:true // helps in searching in database
        },
        avatar:{
            type: String, // cloudinary url
            required: true,
        },
        coverImage:{
            type: String, // cloudinary url
        },
        watchHistory:[{
            type: Schema.Types.ObjectId,
            ref: 'video'
        }],
        password:{
            type:string,
            required: [true, 'Password is required'],
        },
        refreshToken:{
            type: String,
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({id: this._id,email: this.email, username: this.username, fullname: this.fullName}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}

export const user = new mongoose.model('user', userSchema)    

