import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token is required" });
    }

    // verify the token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(403)
        .json({ success: false, message: "Token is invalid" });
    }

    // find the user by their id in token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // user is not authenticated
    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error verifying user" });
  }
};
