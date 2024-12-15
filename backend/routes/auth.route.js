import express from "express";
import { checkAuth, login, logout, register, updateUserProfile } from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// routes with middleware
authRouter.put("/updateProfile", verifyUser, updateUserProfile);

// to return back user details
authRouter.get("/check", verifyUser, checkAuth);

export default authRouter;
