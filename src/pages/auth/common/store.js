import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) throw new Error("Token is missing");

      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        window.localStorage.removeItem("token");
      }
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: !!window.localStorage.getItem("token"),
    token: window.localStorage.getItem("token") || null,
    user: null,
    loading: false,
    error: null,
    initialized: false, // Add this to track initial load
  },
  reducers: {
    handleLogin: (state, action) => {
      const { token } = action.payload;
      state.isAuth = true;
      state.token = token;
      window.localStorage.setItem("token", token);
    },
    handleLogout: (state) => {
      state.isAuth = false;
      state.token = null;
      state.user = null;
      state.initialized = true;
      window.localStorage.removeItem("token");
      toast.success("User logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.initialized = true;
        if (action.error.message.includes('401')) {
          state.isAuth = false;
          state.token = null;
          state.user = null;
          window.localStorage.removeItem("token");
        }
      });
  },
});

export const { handleLogin, handleLogout } = authSlice.actions;
export default authSlice.reducer;