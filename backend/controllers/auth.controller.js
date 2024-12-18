import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// api to register user
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // now check if the user is already registered
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    //now in if condition generate token now by passing user id to this function and then save user in db
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        success: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }
  } catch (error) {
    console.log("Error in register controller :" + error);
    res.status(500).json({
      success: false,
      message: "User registration failed",
    });
  }
};

// api to login user using email and password
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find user using email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with email",
      });
    }

    // compare password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // generate token now by passing user id to this function and then save user in db
    generateToken(user._id, res);
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User login failed",
    });
  }
};

// api to logout user by clearing token from session
export const logout = async (req, res) => {
  try {
    // clear the token from the response
    res.cookie("token", "", { maxAge: 0 });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User logout failed",
    });
  }
};

// api to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    // accessing userId from middleware
    const userId = req.user && req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updateUserProfile = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      updateUserProfile,
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log("Error in update profile api:" + error);
    res.status(500).json({
      success: false,
      message: "User profile update failed",
    });
  }
};

// api to return back user details
export const checkAuth = (req, res) => {
  try {
    // accessing userId from middleware
    const userId = req.user && req.user._id;
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Auth check failed",
    });
  }
};
