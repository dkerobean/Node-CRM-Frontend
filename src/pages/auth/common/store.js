import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialIsAuth = () => {
  const token = window.localStorage.getItem("token");
  return !!token; // Return true if token exists, false otherwise
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: initialIsAuth(),
    token: window.localStorage.getItem("token") || null, // Store the token directly
  },
  reducers: {
    handleLogin: (state, action) => {
      const { token } = action.payload; // Expecting token from the payload
      state.isAuth = true; // Set authentication state to true
      state.token = token; // Store the token in state
      window.localStorage.setItem("token", token); // Save token in local storage
      toast.success("User logged in successfully", {
        position: "top-right",
        autoClose: 1500,
      });
    },

    handleLogout: (state) => {
      state.isAuth = false; // Set authentication state to false
      state.token = null; // Clear token in state
      window.localStorage.removeItem("token"); // Remove token from local storage
      toast.success("User logged out successfully", {
        position: "top-right",
      });
    },
  },
});

export const { handleLogin, handleLogout } = authSlice.actions;
export default authSlice.reducer;
