import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDNIARY_CLOUD_NAME,
    api_key: process.env.CLOUDNIARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDNIARY_CLOUD_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        return response;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation failed
        return null
    }
}

export {uploadOnCloudinary}