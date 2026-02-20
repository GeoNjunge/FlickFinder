import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URI = process.env.MONGO_URI || "";
const connectDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
};

export default connectDatabase;
