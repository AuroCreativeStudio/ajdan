import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchApartmentList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/lists?populate=*`);
    return (response.data.data || []).map((item) => ({
      ...item,
      title: item.title?.Property_Title || null,
    }));
  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};

