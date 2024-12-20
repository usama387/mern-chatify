import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// This is a simple store for chat app to store messages users
export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  //function to call api to get all users and update users state with response that contains users in the app
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/api/messages/users");
      set({ users: response.data.users });
    } catch (error) {
      console.log("Error Response:", error.response.data);
      toast.error(error.message.response.data);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  //function to call api to get all messages by passing other's userid
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/api/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.log("Error Response:", error.response.data);
      toast.error(error.message.response.data);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  //function to update selectedUser state which was null before with current selectedUser by passing it as parameter
  setSelectedUser: (selectedUser) => {
    console.log("Setting selectedUser:", selectedUser);
    set({ selectedUser });
  },
}));
