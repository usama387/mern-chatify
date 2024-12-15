import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectToDb } from "./lib/mongodb.js";
import cookieParser from "cookie-parser";

// app config
const app = express();

// middlewares
app.use(express.json());

// cookie parser middleware to parse cookies from request headers
app.use(cookieParser());

// cors middleware to enable cross-origin resource sharing (CORS) from all ips
app.use(cors());

// dotenv config
dotenv.config();

// test api end point
app.get("/", (req, res) => {
  res.send("API is running on 4000...");
});

// auth apis end point
app.use("/api/auth", authRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
  connectToDb();
});
