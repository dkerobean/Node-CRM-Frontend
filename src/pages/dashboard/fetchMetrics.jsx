import axios from "axios";
import { useSelector } from "react-redux";

// Define fetchMetrics as a hook or a function to use inside a component
const useFetchMetrics = () => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage
  const user = useSelector((state) => state.auth.user); // Get user from Redux store

  const getMetrics = async () => {
    if (!token || !user?._id) {
      console.error("No token or user ID found");
      return null;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/metrics/all/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return fetched metrics
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return null; // Handle error
    }
  };

  return getMetrics; // Return the function to call it later
};

export default useFetchMetrics;
