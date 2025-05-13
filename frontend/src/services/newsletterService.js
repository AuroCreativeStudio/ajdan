import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in your environment variables

export const subscribeToNewsletter = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/newsletters`,
      { data }, // Send the email data
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`, // Add token if required
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error.response?.data || error.message);
    throw error;
  }
};
