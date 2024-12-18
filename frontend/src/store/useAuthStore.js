import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  // this state contains logged in user details passed from signUp api
  authUser: null,

  // this state is used to control the loading state of the signup api
  isSigningUp: false,

  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  // function to call api to check if user is logged in or not if logged in save user authUser state with set
  checkUserAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error Response:", error.response.data);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // function to call api to register a user the from data comes from Register Page where this function is destructured once the function executes with success using set action it wil save the user data in authUser state state which was null before
  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/api/auth/register", formData);
      set({ authUser: response.data });
      toast.success("User registered successfully!");
    } catch (error) {
      console.log("Error Response:", error.response.data);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // function to call logout api and then on success set authUser state back to null
  logout: async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("User logged out successfully!");
      set({ authUser: null });
    } catch (error) {
      console.log("Error Response:", error.response.data);
      toast.error(error.response.data.message);
    }
  },
}));
