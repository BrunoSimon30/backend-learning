import mongoose from "mongoose";
import logger from "./logger.js";

const mongooseConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/ecommerceDatabase`);
        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error(error);
    }
}

export default mongooseConnection;