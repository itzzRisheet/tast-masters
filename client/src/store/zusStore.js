import { create } from "zustand";

export const useAuthStore = create((set) => ({
  auth: {
    username: "",
    email: "",
    profile: "",
  },
  setUsername: (name) => {
    set((state) => ({ auth: { ...state.auth, username: name } }));
  },
  setEmail: (email) => {
    set((state) => ({ auth: { ...state.auth, email: email } }));
  },
}));

export const useLocalStorage = create((set) => ({
  isLogin: localStorage.getItem("token") ? true : false,
  setIsLogin: () => {
    set((state) => ({ isLogin: localStorage.getItem("token") ? true : false }));
  },
}));

export const useSideBar = create((set) => ({
  showSidebar: false,
  setShowSidebar: () => {
    set((state) => ({ showSidebar: !state.showSidebar }));
  },
}));
