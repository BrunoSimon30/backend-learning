import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


 

 const mongooseConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log("Connected to MongoDB");
       
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
 }

 export default mongooseConnection;