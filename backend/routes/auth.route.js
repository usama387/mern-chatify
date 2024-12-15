import express from "express";
import { login, logout, register, updateUserProfile } from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.put("/updateProfile", verifyUser, updateUserProfile);

export default authRouter;
