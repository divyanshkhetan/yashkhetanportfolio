import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  const mongodburl = process.env.MONGODB_URL;
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(mongodburl);
  return handler(req, res);
};

export default connectDB;