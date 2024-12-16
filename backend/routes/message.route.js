import express from "express";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

// route to get all other users
messageRouter.get("/users", verifyUser, getUsersForSidebar);

// route to get messages for with a specific user
messageRouter.get("/:id", verifyUser, getMessages);

//route add new message 
messageRouter.post("/send/:id", verifyUser, sendMessage);

export default messageRouter;
