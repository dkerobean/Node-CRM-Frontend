import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Check if the user is authenticated based on the presence of a token
const initialIsAuth = () => {
  const token = window.localStorage.getItem("token");
  return !!token;
};

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    const token = window.localStorage.getItem("token"); // Get the token directly from local storage
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      return response.data; // Return user data from API response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user data");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: initialIsAuth(),
    token: window.localStorage.getItem("token") || null,
    user: null, // To store user data
  },
  reducers: {
    handleLogin: (state, action) => {
      const { token } = action.payload;
      state.isAuth = true;
      state.token = token;
      window.localStorage.setItem("token", token); // Save token to local storage
      toast.success("User logged in successfully store", {
        position: "top-right",
        autoClose: 1500,
      });
    },
    handleLogout: (state) => {
      state.isAuth = false;
      state.token = null;
      state.user = null; // Clear user data on logout
      window.localStorage.removeItem("token"); // Remove token from local storage
      toast.success("User logged out successfully", {
        position: "top-right",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload; // Store user data in state
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        toast.error(action.payload || "Failed to load user data");
      });
  },
});

// Export actions and reducer
export const { handleLogin, handleLogout } = authSlice.actions;
export default authSlice.reducer;
