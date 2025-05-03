import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchApartmentList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/lists`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};
