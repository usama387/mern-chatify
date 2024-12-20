// to store theme in localStorage to prevent reset on page reload
import { create } from "zustand";

// by default coffee theme is selected and set function will change it
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
