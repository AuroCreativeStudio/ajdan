import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in your environment variables

export const subscribeToNewsletter = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/newsletters`, { data });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error.response?.data || error.message);
    throw error;
  }
};

export const getNewsLetter = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/newsletters`);
    return response.data;
  } catch (error){
    console.error("Error fetching newsletters:",error.response?.data || error.message);
    throw error;
  }
}
// In your newsletterService.js
export const deleteNewsletter = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/newsletters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting NewsLetter:', error.response?.data || error.message);
    throw error;
  }
};
