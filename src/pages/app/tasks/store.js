import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

// Define async thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
  'approject/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token');

      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,  // Add the token here
        }
      };

      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/all`, config);
      return response.data.tasks;
      console.log(response.data.tasks);
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const appProjectSlice = createSlice({
  name: "approject",
  initialState: {
    openProjectModal: false,
    isLoading: false,
    editItem: {},
    editModal: false,
    projects: [],
    error: null,
  },
  reducers: {
    toggleAddModal: (state, action) => {
      state.openProjectModal = action.payload;
    },
    toggleEditModal: (state, action) => {
      state.editModal = action.payload;
    },
    pushTask: (state, action) => {
      state.projects.unshift(action.payload);

      toast.success("Add Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    removeTask: (state, action) => {
      state.projects = state.projects.filter((item) => item.id !== action.payload);
      toast.warning("Remove Successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    updateTask: (state, action) => {
      state.editItem = action.payload;
      state.editModal = !state.editModal;
      let index = state.projects.findIndex((item) => item.id === action.payload.id);
      state.projects.splice(index, 1, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error("Failed to fetch tasks", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  },
});

export const { toggleAddModal, toggleEditModal, pushTask, removeTask, updateTask } = appProjectSlice.actions;

export default appProjectSlice.reducer;
