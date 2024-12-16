import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// api to get users for sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get the user id from the request
    const loggedInUser = req.user._id;

    // Exclude the logged in user from the list of users
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    // Return the filtered users as JSON response
    res.status(200).json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error("Error getting users for sidebar:", error);
    return res.status(500).json({
      success: false,
      message: "Server error getting users for sidebar",
    });
  }
};

// api to get messages
export const getMessages = async (req, res) => {
  try {
    // get user to chat id from the request parameters
    const { id: userToChatId } = req.params;

    // now logged in user id
    const myId = req.user._id;

    // the messages with $or fetches the messages where sender is me and receiver is other user and also where receiver is me and sender is other user
    const messages = await Message.find({
      $or: [
        {
          sender: myId,
          receiver: userToChatId,
        },
        {
          sender: userToChatId,
          receiver: myId,
        },
      ],
    });

    // return the messages as JSON response
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error getting messages",
    });
  }
};

// api to send message to a user it could be an image or text
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    // get user to chat id from the request parameters
    const { id: receiverId } = req.params;

    // now logged in user id
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // upload the image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: realtime functionality with socket.io

    // return the message as JSON response
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error sending message",
    });
  }
};
