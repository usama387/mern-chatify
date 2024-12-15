import mongoose from "mongoose";

// function to connect to MongoDB
export const connectToDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB connection established");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log("Mongodb connection :" + error);
  }
};
