import mongoose  from "mongoose";
import {DB_NAME} from "../constants.js";

//const connectionInstance = null;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
          );
        console.log(`Connected to DB , DB Host ${connectionInstance.connection.host}`)
    } catch (error) {
        //console.log(`URL is ${connectionInstance}`)
        console.log("Mongo Db Connection ERROR: "+error)
        throw error
        process.exit(1)
    }
}

export default connectDB;
